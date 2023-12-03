import * as THREE from 'three';

window.addEventListener('load', () => {
  init();
});

function init() {
  const canvas = document.querySelector('#canvas');

  const renderer = new THREE.WebGL1Renderer({
    antialias: true,
    alpha: true,
    canvas, //canvas를 렌더러에 전달
  });
  //renderer인스턴스에는 캔버스 돔요소가 들어가있음(지정해주면 해당 캔버스 전달)

  //   renderer.setClearColor('#00ccff', 0.5);
  renderer.setSize(window.innerWidth, window.innerHeight);

  //scene 불러오기
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500);

  //-------카메라 위치지정------
  camera.position.set(0, 25, 150);

  //-------웨이브------
  const waveGeometry = new THREE.PlaneGeometry(1500, 1500, 150, 150); //뒤2개는 세그먼트
  const waveMaterial = new THREE.MeshStandardMaterial({
    // wireframe: true,
    color: '#00ffff',
  });

  const wave = new THREE.Mesh(waveGeometry, waveMaterial);
  wave.rotation.x = -Math.PI / 2; //-90도

  //-------웨이브 만들기--------

  //   console.log(waveGeometry.attributes.position);
  // 위의 배열에서 3차원에서 xyz의 값을 순서대로 3개씩 묶어서 하나의 정점의 위치값을 의미(정점의 개수 22801)

  const waveHeight = 2.5;

  //정점의 z값을 랜덤으로 해서 웨이브 만들기
  //-------웨이브 만들기 방법 1--------
  //   for (let i = 0; i < waveGeometry.attributes.position.array.length; i += 3) {
  //     waveGeometry.attributes.position.array[i + 2] += (Math.random() - 0.5) * waveHeight;
  //     //Math.random() - 0과 1사이의 값 / -0.5하면 -0.5에서 0.5사이의 값
  //     //z좌표의 값을 다 다르게 설정 랜덤으로
  //   }

  //-------웨이브 만들기 방법 2--------
  for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
    const z = waveGeometry.attributes.position.getZ(i) + (Math.random() - 0.5) * waveHeight;
    waveGeometry.attributes.position.setZ(i, z);
  }

  scene.add(wave);

  //--------포인트 빛------
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(15, 15, 15);
  scene.add(pointLight);

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
