// @ts-nocheck
class Pon extends THREE.Mesh {
    constructor() {
        super()
        this.geometry = new THREE.CylinderGeometry(0.7, 0.7, 1, 32)
        this.material = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, shininess: 50, side: THREE.DoubleSide });
    }
}