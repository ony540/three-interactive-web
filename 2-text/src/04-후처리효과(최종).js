import * as THREE from 'three';
// import typeface from 'three/examples/fonts/helvetiker_bold.typeface.json'
// 내장된 폰트 외의 사용하고싶은 폰트를 typeface로 전환해서 사용
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
//포스트프로세싱 후처리

window.addEventListener('load', () => {
  init();
});

async function init() {
  const gui = new GUI();

  const renderer = new THREE.WebGL1Renderer({
    antialias: true,
  });
  //renderer인스턴스에는 캔버스 돔요소가 들어가있음

  //그림자를 생성하겠다
  renderer.shadowMap.enabled = true;

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

  //--------글자--------
  const textGeometry = new TextGeometry(`Boo Lovers Club`, {
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

  //text에 의한 그림자 생성되도록
  text.castShadow = true;

  //중앙정렬하기
  textGeometry.center();

  // 재질
  const textureLoader = new THREE.TextureLoader().setPath('./asset/textures/');
  // async 안해도 된다!!!
  const textTexture = textureLoader.load('holographic.jpeg');
  textMaterial.map = textTexture;

  scene.add(text);

  // --------벽--------
  const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
  const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.z = -6;
  plane.receiveShadow = true;
  scene.add(plane);

  //-------- ambient조명--------
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  //-------- spot조명------
  //색상, 강도, 거리, 퍼지는각도, 감쇄하는정도, 거리에따라 빛이 어두어지는 양
  const spotLight = new THREE.SpotLight(0xffffff, 2.5, 30, Math.PI * 0.2, 0.2, 0.5);
  spotLight.position.set(0, 0, 3);

  //그림자 주도록하기
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024; // 해상도(기본값512)
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.radius = 10; //그림자 외곽블러

  //spotLight 기본적으로 타겟을 가지고있음
  spotLight.target.position.set(0, 0, -3);

  // 재질
  const spotlightTexture = textureLoader.load('gradient.jpg');
  //재질 인코딩방식
  spotlightTexture.encoding = THREE.sRGBEncoding;
  // THREE.LinearEncoding 가 기본값
  spotLight.map = spotlightTexture;
  scene.add(spotLight, spotLight.target);

  // --------마우스 인터랙션--------
  window.addEventListener('mousemove', (event) => {
    // 0~1 사이 - 0.5 (사분면같은 값 찍힘)
    const x = (event.clientX / window.innerWidth - 0.5) * 5;
    const y = -(event.clientY / window.innerHeight - 0.5) * 5;
    console.log(x, y);
    // threejs에서는 y축이 위로올라갈수록 +
    spotLight.target.position.set(x, y, -3);
  });

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

  spotLightFolder.add(spotLight.shadow, 'radius').min(1).max(20).step(0.01).name('shadow.radius'); //그림자 외곽 흐리게

  //--------후처리--------
  const composer = new EffectComposer(renderer);

  //렌더패스 이팩트 내부적으로 일어나는걸 렌더러에 기본적으로 적용
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  //언리얼블루패스 - 레이저광선효과낼때 사용하는 후처리효과
  const unrealBloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight), //해상도 설정을 위한 백터값
    1.2, //강도
    1, //radius
    0 //threshold- 얼마만큼의 빛을 받았을때 효과가 적용될것인지 (1일수록 적게)
  );
  composer.addPass(unrealBloomPass);

  const unrealBloomPassFolder = gui.addFolder('UnrealBloomPass');
  unrealBloomPassFolder.add(unrealBloomPass, 'strength').min(0).max(3).step(0.01);
  unrealBloomPassFolder.add(unrealBloomPass, 'radius').min(0).max(1).step(0.01);
  unrealBloomPassFolder.add(unrealBloomPass, 'threshold').min(0).max(1).step(0.01);

  //--------씬렌더--------
  render();

  function render() {
    composer.render();
    // renderer.render(scene, camera);

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
