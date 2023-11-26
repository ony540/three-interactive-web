import * as THREE from 'three';
// const card = new Card(
//   width:2,
//   height: 3,
//   color: '#0077ff'
// );
function toRadian(deg) {
  return (deg * Math.PI) / 180;
}

class Card {
  constructor({ width, height, radius, color }) {
    const x = width / 2 - radius;
    const y = height / 2 - radius;
    const shape = new THREE.Shape();
    shape
      .absarc(x, y, radius, toRadian(90), 0, true)
      .lineTo(x + radius, -y)
      .absarc(x, -y, radius, 0, -toRadian(90), true)
      .lineTo(-x, -(y + radius))
      .absarc(-x, -y, radius, toRadian(-90), toRadian(180), true)
      .lineTo(-(x + radius), y)
      .absarc(-x, y, radius, toRadian(180), toRadian(90), true);

    // const geometry = new THREE.PlaneGeometry(width, height); - 직사각판
    // const geometry = new THREE.ShapeGeometry(shape); - 지정한 모양판
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.01, //두께 설정
      bevelThickness: 0.1, //바벨 평평하게 숫자줄이기
    }); //두께있는 판
    const material = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
      // side: THREE.DoubleSide - 양면 렌더되도록
      roughness: 0.5,
      metalness: 0.5,
      //메탈 제질 표현
    });
    const mesh = new THREE.Mesh(geometry, material);
    this.mesh = mesh;
  }
}

export default Card;
