import * as THREE from 'three';
import { GUI } from 'lil-gui';

window.addEventListener('load', () => {
  init();
});

function init() {
  const gui = new GUI();

  const canvas = document.querySelector('#canvas');

  const renderer = new THREE.WebGL1Renderer({
    antialias: true,
    alpha: true,
    canvas, //canvas를 렌더러에 전달
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  //scene 불러오기
  const scene = new THREE.Scene();

  //--------안개---------
  //방법1 - 거리지정이 가능함
  scene.fog = new THREE.Fog(0xf0f0f0, 0.1, 500);
  //인자 - 색상, 카메라로부터 얼마나가까이, 멀리 보일건지 (far 값이후로는 지정색으로 가득참)

  //방법2 - 더 현실적인 느낌
  //   scene.fog = new THREE.FogExp2(0xf0f0f0, 0.005);
  //제곱지수 - 카메라 근처에서는 옅게 보이다가 인자로 전달되는 거듭제곱지수 값만큼 기하급수적으로 뿌얘지는 것을 의미

  //   gui.add(scene.fog, 'near').min(0).max(100).step(0.1);
  //   gui.add(scene.fog, 'far').min(100).max(500).step(0.1);

  //-------카메라지정------
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500);

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

  const waveHeight = 2.5;
  const initialZpositions = [];

  //-------정점의 z값을 랜덤으로 해서 웨이브 만들기--------
  for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
    const z = waveGeometry.attributes.position.getZ(i) + (Math.random() - 0.5) * waveHeight;
    waveGeometry.attributes.position.setZ(i, z);
    initialZpositions.push(z);
  }

  //--- 파도일렁이는 함수 만들기(파도 인스턴스의 매서드로 만들기)-----
  wave.update = function () {
    const elapsedTime = clock.getElapsedTime();

    //count 는 정점의 개수
    for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
      // waveGeometry.attributes.position.array[i + 2] += elapsedTime * 0.01; //위로 올라만감
      // waveGeometry.attributes.position.array[i + 2] = Math.sin(elapsedTime * 3) * waveHeight; //전부 같은 값
      // const z = initialZpositions[i] + Math.sin(elapsedTime * 3) * waveHeight; //전부 같은 속도로 아래위 이동
      // const z = initialZpositions[i] + Math.sin(elapsedTime * 3 + i) * waveHeight; //전부 선형적으로 동일한 가속도로 규칙적으로 움직임
      const z = initialZpositions[i] + Math.sin(elapsedTime * 3 + i ** 2) * waveHeight; //거듭제곱이면 다 다른 속도로 일렁인다
      waveGeometry.attributes.position.setZ(i, z);
    }

    waveGeometry.attributes.position.needsUpdate = true;
  };

  scene.add(wave);

  //--------포인트 빛------
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(15, 15, 15);
  scene.add(pointLight);

  //--------방향이 있는 빛------
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);

  directionalLight.position.set(-15, 15, 15);

  scene.add(directionalLight);
  const clock = new THREE.Clock();

  //--------씬렌더--------
  render();

  function render() {
    wave.update();

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
