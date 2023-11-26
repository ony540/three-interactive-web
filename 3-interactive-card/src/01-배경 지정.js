import * as THREE from 'three';

window.addEventListener('load', () => {
  init();
});

function init() {
  const renderer = new THREE.WebGL1Renderer({
    antialias: true,
    alpha: true, //배경이 투명하게 처리
  });
  //renderer인스턴스에는 캔버스 돔요소가 들어가있음

  //1. 배경 투명, 색 지정
  renderer.setClearAlpha(0.2); //  배경 0.5정도 투명하게 설정
  renderer.setClearColor(0x00aaff, 0.2); //  배경 색과 투명도 설정

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  //scene 불러오기
  const scene = new THREE.Scene();

  //2. 색으로 지정
  scene.background = new THREE.Color(0x00aaff);

  //3.이미지로 배경지정 (주소로 texture)
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(
    'https://images.unsplash.com/photo-1503480207415-fdddcc21d5fc?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2t5JTIwdGV4dHVyZXxlbnwwfHwwfHx8MA%3D%3D'
  );
  scene.background = texture;


  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500);

  //-------카메라 위치지정------
  camera.position.z = 5;

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
