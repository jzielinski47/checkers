// @ts-nocheck
class Cube extends THREE.Mesh {
    constructor(x, y, z) {
        super()
        this.geometry = new THREE.BoxGeometry(x, y, z);
        this.material = new THREE.MeshPhongMaterial({ color: 0xf2f2f2, specular: 0xffffff, shininess: 100, side: THREE.DoubleSide, map: new THREE.TextureLoader().load("img/white.png") });
    }
}