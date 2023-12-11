import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

window.addEventListener('load', () => {
  init();
});

function init() {
  const renderer = new THREE.WebGL1Renderer({
    antialias: true,
  });
  //renderer인스턴스에는 캔버스 돔요소가 들어가있음

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  //scene 불러오기
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500);

  //-------카메라 위치지정------
  camera.position.z = 5;

  new OrbitControls(camera, renderer.domElement);

  //--------파티클 효과------
  const geometry = new THREE.BufferGeometry();
  const count = 1000;

  const positions = new Float32Array(count * 3); //각정점의 xyz좌표를 하나의 아이템으로 갖는 평행배열 평태

  for (let i; i < count; i++) {
    //-0.5~0.5 사이의 임의값 넣어줌 (1의 절반이 0.5이므로)
    positions[i * 3] = THREE.MathUtils.randFloatSpread(10);
    positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(10);
    positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(1);
  }

  //positions의 점 3가 모여서 하나의 배열임을 의미
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  //   const material = new THREE.MeshBasicMaterial({
  const material = new THREE.PointsMaterial({
    color: 0xccaaff,
    size: 0.5,
    // sizeAttenuation: false, //점크기의 원근을 안줄수도 있음 전부 같은크기
    // wireframe: true,
  });

  //   const points = new THREE.Mesh(geometry, material);
  const points = new THREE.Points(geometry, material);

  scene.add(points);

  //--------씬렌더--------
  render();

  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  //-----Renderer 리사이징--------
  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', handleResize);
}
