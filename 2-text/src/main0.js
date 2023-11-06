import * as THREE from "three";
// import typeface from 'three/examples/fonts/helvetiker_bold.typeface.json'
// 내장된 폰트 외의 사용하고싶은 폰트를 typeface로 전환해서 사용
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
// import typeface from "./asset/fonts/Gmarket Sans Medium_Regular.json";

window.addEventListener("load", () => {
  init();
});

function init() {
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
  camera.position.z = 5;

  //   Font
  const fontLoader = new FontLoader();

  //  방법 1
  //   fontLoader.load(
  //     "./asset/fonts/Gmarket Sans Medium_Regular.json",
  //     //로드 콜백함수
  //     (font) => {
  //       console.log("load", font);
  //     },
  //     // 프로그래스 콜백함수
  //     (event) => {
  //       console.log("progess", event);
  //     },
  //     // 에러 콜백함수
  //     (error) => {
  //       console.log("error", error);
  //     }
  //   );
  // 프로그래스가 계속일어나다가 폰트가 로드되면 로드 콜백한번 일어나고 끝남

  //방법2
  //   const font = fontLoader.parse(typeface);

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

  window.addEventListener("resize", handleResize);
}
