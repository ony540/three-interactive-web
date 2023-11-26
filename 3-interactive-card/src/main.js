import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { gsap } from 'gsap';
import Card from './Card';

window.addEventListener('load', () => {
  init();
});

function init() {
  const gui = new GUI();

  const COLORS = ['#ff6e6e', '#31e0c1', '#006fff', '#ffd732'];

  const renderer = new THREE.WebGL1Renderer({
    antialias: true,
    alpha: true, //배경이 투명하게 처리
  });
  //renderer인스턴스에는 캔버스 돔요소가 들어가있음

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  //scene 불러오기
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500);

  //-------카메라 위치지정------
  camera.position.z = 25;

  //-------컨트롤 설정-------
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 3.5;
  controls.rotateSpeed = 0.75;
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.minPolarAngle = Math.PI / 2 - Math.PI / 3;
  controls.maxPolarAngle = Math.PI / 2 + Math.PI / 3;

  //-----카드불러오기------
  const card = new Card({
    width: 10,
    height: 15.8,
    color: COLORS[0],
    radius: 0.5,
  });

  card.mesh.rotation.z = Math.PI * 0.1;

  scene.add(card.mesh);

  //--------GUI-------
  const cardFolder = gui.addFolder('Card');

  cardFolder
    .add(card.mesh.material, 'roughness')
    .min(0)
    .max(1)
    .step(0.01)
    .name('material.roughness');

  cardFolder
    .add(card.mesh.material, 'metalness')
    .min(0)
    .max(1)
    .step(0.01)
    .name('material.metalness');

  //--------조명-------
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  ambientLight.position.set(-5, -5, -5);
  scene.add(ambientLight);

  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
  const directionalLight2 = directionalLight1.clone();

  directionalLight1.position.set(1, 1, 3);
  directionalLight2.position.set(-1, 1, -3);

  scene.add(directionalLight1, directionalLight2);
  //--------씬렌더--------
  render();

  function render() {
    controls.update();
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

  //-------색상 변경 버튼 추가----------
  const container = document.querySelector('.container');
  COLORS.forEach((color) => {
    const button = document.createElement('button');
    button.style.backgroundColor = color;

    button.addEventListener('click', () => {
      card.mesh.material.color = new THREE.Color(color);

      //-------gsap 애니메이팅------
      gsap.to(card.mesh.rotation, { y: -Math.PI / 2, duration: 1, ease: 'back.out(2.5)' });
      //https://gsap.com/docs/v3/Eases/
    });

    container.append(button);
  });
}
