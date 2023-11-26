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
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  //색상, 강도, 거리, 퍼지는각도, 감쇄하는정도, 거리에따라 빛이 어두어지는 양
  const spotLight = new THREE.SpotLight(0xffffff, 2.5, 30, Math.PI * 0.15, 0.2, 0.5);
  spotLight.position.set(0, 0, 3);
  //spotLight 기본적으로 타겟을 가지고있음
  spotLight.target.position.set(0, 0, -3);

  scene.add(spotLight, spotLight.target);

  // 마우스 인터랙션
  window.addEventListener('mousemove', (event) => {
    // 0~1 사이 - 0.5 (사분면같은 값 찍힘)
    const x = (event.clientX / window.innerWidth - 0.5) * 5;
    const y = -(event.clientY / window.innerHeight - 0.5) * 5;
    console.log(x, y);
    // threejs에서는 y축이 위로올라갈수록 +
    spotLight.target.position.set(x, y, -3);
  });

  //spotLight 헬퍼
  const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(spotLightHelper);

  //spotLight GUI
  const spotLightFolder = gui.addFolder('SpotLight');

  spotLightFolder
    .add(spotLight, 'angle')
    .min(0)
    .max(Math.PI / 2)
    .step(0.01);

  spotLightFolder.add(spotLight.position, 'z').min(1).max(10).name('position.z');
  spotLightFolder.add(spotLight, 'distance').min(1).max(30).step(0.01); //빛의 거리
  spotLightFolder.add(spotLight, 'decay').min(0).max(10).step(0.01); // 숫자클수록 빛이 희미해짐
  spotLightFolder.add(spotLight, 'penumbra').min(0).max(1).step(0.01); // 빛의 경계가 1에 가까울수록 희려짐

  //--------씬렌더--------
  render();

  function render() {
    renderer.render(scene, camera);
    spotLightHelper.update();

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
