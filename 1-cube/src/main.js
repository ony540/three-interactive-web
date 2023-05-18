import * as THREE from "three";

window.addEventListener("load", () => {
    init();
});

function init() {
    // console.log(THREE);
    const renderer = new THREE.WebGL1Renderer({
        // alpha:true, //투명하게하기
        antialias:true,
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

    const geometry = new THREE.BoxGeometry(2, 2, 2); //높이너비깊이
    // const material = new THREE.MeshBasicMaterial({ color: 0xcc99ff }); //재질 색상 MeshBasic - 빛에 의한 음영을 확인하지못함
    const material = new THREE.MeshStandardMaterial({ color: 0xcc99ff }); //재질 색상 MeshBasic - 빛에 의한 음영을 확인하지못함

    const cube = new THREE.Mesh(geometry, material);

    //큐브 추가 기본위치에 지정
    scene.add(cube);

    //카메라 위치지정
    // camera.position.z = 5; //하나씩지정 
    camera.position.set(3,4,5);
    camera.lookAt(cube.position); //상관없이 그냥 큐브위치를 바라보도록

    const directionalLight = new THREE.DirectionalLight(0xf0f0f0, 1); //색상, 강도
    directionalLight.position.set(-1,2,3); //빛위치지정

    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1); //색상, 강도
    ambientLight.position.set(3,2,1); //빛위치지정

    scene.add(ambientLight);





    // 씬렌더
    renderer.render(scene, camera);
}
