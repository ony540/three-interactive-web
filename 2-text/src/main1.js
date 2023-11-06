import * as THREE from 'three';
// import typeface from 'three/examples/fonts/helvetiker_bold.typeface.json'
// 내장된 폰트 외의 사용하고싶은 폰트를 typeface로 전환해서 사용
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

window.addEventListener('load', () => {
  init();
});

async function init() {
  const gui = new GUI();

  const renderer = new THREE.WebGL1Renderer({
    antialias: true,
  });
  //renderer인스턴스에는 캔버스 돔요소가 들어가있음
  //typedac

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  //scene 불러오기
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500);

  //-------카메라 위치지정------
  camera.position.set(0, 1, 5);

  new OrbitControls(camera, renderer.domElement);

  //   Font
  const fontLoader = new FontLoader();

  const font = await fontLoader.loadAsync('./asset/fonts/Daydream_Thin.json');

  const textGeometry = new TextGeometry('Boo Lovers Club', {
    font,
    size: 0.5,
    height: 0.1,
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  });
  const textMaterial = new THREE.MeshPhongMaterial();

  const text = new THREE.Mesh(textGeometry, textMaterial);

  //중앙정렬하기

  // 방법1. textGeometry.boundingBox - 박스의 시작, 끝점(min max) 조회가능
  // textGeometry.computeBoundingBox();
  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x) * 0.5,
  //   -(textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y) * 0.5,
  //   -(textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z) * 0.5
  // );

  //방법2. center()
  textGeometry.center();

  // 재질
  const textureLoader = new THREE.TextureLoader().setPath('./asset/textures/');
  // async 안해도 된다!!!
  const textTexture = textureLoader.load('holographic.jpeg');
  textMaterial.map = textTexture;

  scene.add(text);

  // 벽
  const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
  const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.z = -10;
  scene.add(plane);
  // 조명
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  //색상, 강도, 거리, 퍼지는각도, 감쇄하는정도, 거리에따라 빛이 어두어지는 양
  const spotLight = new THREE.SpotLight(0xffffff, 2.5, 30, Math.PI * 0.15, 0.2, 0.5);
  spotLight.position.set(0, 0, 3);
  scene.add(spotLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.position.set(3, 0, 2);
  scene.add(pointLight);

  // const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
  // scene.add(pointLight, pointLightHelper);

  gui.add(pointLight.position, 'x').min(-3).max(3).step(0.1);

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
