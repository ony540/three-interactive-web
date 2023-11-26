import * as THREE from "three";
// 컨트롤은 따로 임포트
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

window.addEventListener("load", () => {
    init();
});

function init() {
    // console.log(THREE);
    const renderer = new THREE.WebGL1Renderer({
        antialias: true,
    });
    //renderer인스턴스에는 캔버스 돔요소가 들어가있음

    renderer.setSize(window.innerWidth, window.innerHeight);

    //돔에 캔버스 추가
    document.body.appendChild(renderer.domElement);

    //scene 불러오기
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75, //시야각 fov(field of view) - 이각도가 넓어지면 광각 어안렌즈
        window.innerWidth / window.innerHeight, //카메라종횡비
        1, //near 얼마나 가까이
        500 //far 멀리 볼수 있는지
    );

    //-----controls mesh가 움직이는게 아니라 카메라의 각도가 달라지는 것
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 10;
    controls.enableZoom = true;
    controls.enablePan = true; //카메라 좌우로 움직이기 가능 (우클릭 후) - 기본값이 true
    controls.maxDistance = 100;
    controls.minDistance = 1; //줌 가능 범위 제어

    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = Math.PI / 3; //수직방향으로 카메라를 얼마나 돌릴 수 있는지
    controls.maxAzimuthAngle = Math.PI / 2;
    controls.minAzimuthAngle = Math.PI / 3; //수평방향으로 카메라를 얼마나 돌릴 수 있는지

    controls.enableDamping = true; //드래그 다음 조금 움직이다가 넘어감 관성유지
    // controls.dampingFactor = 0.01; //관성의 정도 0.05보다 작으면 더 오랫동안 관성유지 (움직임)

    //----축위치 확인 객체---
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    //------cube
    const cubeGeometry = new THREE.IcosahedronGeometry(1); //반지름
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: new THREE.Color(0xcc99ff), emissive: 0x111111 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    const skeletonGeometry = new THREE.IcosahedronGeometry(2);
    const skeletonMaterial = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.2 });
    const skeleton = new THREE.Mesh(skeletonGeometry, skeletonMaterial);

    //큐브 추가 기본위치에 지정
    scene.add(cube, skeleton);

    //-------카메라 위치지정------
    camera.position.z = 5;

    //조명
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); //색상, 강도
    scene.add(directionalLight);

    //clock 객체
    const clock = new THREE.Clock();

    //--------씬렌더--------
    render();

    function render() {
        const elapsedTime = clock.getElapsedTime();

        // cube.rotation.x = elapsedTime;
        // cube.rotation.y = elapsedTime;

        // skeleton.rotation.x = elapsedTime * 1.5;
        // skeleton.rotation.y = elapsedTime * 1.5;

        // 오르빗컨트롤 업데이트 필요
        controls.update();

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    //-----Renderer 리사이징--------
    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        //이거를 해줘야 camera에 변경사항이 있을때 적용이 된다.

        controls.update();
        // 오르빗컨트롤 업데이트 필요

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }

    window.addEventListener("resize", handleResize);
}
