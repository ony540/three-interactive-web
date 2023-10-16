import * as THREE from "three";

window.addEventListener("load", () => {
    init();
});

function init() {
    // console.log(THREE);
    const renderer = new THREE.WebGL1Renderer({
        // alpha:true, //투명하게하기
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

    //------geometry - 덩어리
    const geometry = new THREE.BoxGeometry(2, 2, 2); //높이너비깊이

    //------material - 재질
    // const material = new THREE.MeshBasicMaterial({ color: 0xcc99ff }); //재질 색상 MeshBasic - 빛에 의한 음영을 확인하지못함
    const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xcc99ff), transparent: true, opacity: 0.8, side: THREE.DoubleSide });

    material.color = new THREE.Color(0x00c896);

    const cube = new THREE.Mesh(geometry, material);

    //큐브 추가 기본위치에 지정
    scene.add(cube);

    //-------카메라 위치지정------
    // camera.position.z = 5; //하나씩지정
    camera.position.set(3, 4, 5);
    camera.lookAt(cube.position); //상관없이 그냥 큐브위치를 바라보도록

    //조명
    const directionalLight = new THREE.DirectionalLight(0xf0f0f0, 1); //색상, 강도
    directionalLight.position.set(-1, 2, 3); //빛위치지정

    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1); //색상, 강도
    ambientLight.position.set(3, 2, 1); //빛위치지정

    scene.add(ambientLight);

    //--------씬렌더--------
    renderer.render(scene, camera);

    //-----Renderer 리사이징--------
    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        //이거를 해줘야 camera에 변경사항이 있을때 적용이 된다.

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }

    window.addEventListener("resize", handleResize);
}
