import * as THREE from "three";

window.addEventListener("load", () => {
    init();
});

function init() {
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

    window.addEventListener("resize", handleResize);
}
