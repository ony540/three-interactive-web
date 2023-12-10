import * as THREE from 'three';
import { GUI } from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

window.addEventListener('load', () => {
  init();
});

async function init() {
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
  wave.receiveShadow = true; //파도 위에 그림자가 생길 수 있음

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
      const z = initialZpositions[i] + Math.sin(elapsedTime * 3 + i ** 2) * waveHeight; //거듭제곱이면 다 다른 속도로 일렁인다
      waveGeometry.attributes.position.setZ(i, z);
    }

    waveGeometry.attributes.position.needsUpdate = true;
  };

  scene.add(wave);

  //--------배 모델링 파일 들고오기------
  const gltfLoader = new GLTFLoader();

  const gltf = await gltfLoader.loadAsync('./models/ship/scene.gltf');

  const ship = gltf.scene; //모델링파일

  ship.castShadow = true; //이것의 그림자가 생김

  //--------!! traverse -> scene의 모든 요소를 탐색할 수 있는 메서드!!---------
  ship.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
    }
  });

  //제자리에서 아래위 움직이도록 y축 애니메이션
  ship.update = function () {
    const elapsedTime = clock.getElapsedTime();
    ship.position.y = Math.sin(elapsedTime * 3);
  };

  ship.rotation.y = Math.PI;

  ship.scale.set(40, 40, 40); //크기 키우기
  scene.add(ship);

  //--------포인트 빛------
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(15, 15, 15);

  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 1024; //그림자해상도
  pointLight.shadow.mapSize.height = 1024;
  pointLight.shadow.radius = 10; //그림자끝 블러

  scene.add(pointLight);

  //--------방향이 있는 빛------
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);

  directionalLight.position.set(-15, 15, 15);

  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.radius = 10;

  scene.add(directionalLight);
  const clock = new THREE.Clock();

  //--------씬렌더--------
  render();

  function render() {
    wave.update();
    ship.update();

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
