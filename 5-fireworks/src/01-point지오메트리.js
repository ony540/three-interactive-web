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
  const geometry = new THREE.SphereGeometry();

  //   const material = new THREE.MeshBasicMaterial({
  const material = new THREE.PointsMaterial({
    color: 0xccaaff,
    size: 10,
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
