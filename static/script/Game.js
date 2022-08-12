// @ts-nocheck
// const { Vector3 } = require("./modules/three");

class Game {
    constructor() {

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x272727);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("canvas").append(this.renderer.domElement);

        this.color = '';
        this.selectedPon;

        this.materials = {
            tiles: {
                black: new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, shininess: 100, side: THREE.DoubleSide, map: new THREE.TextureLoader().load("img/black.png") }),
                white: new THREE.MeshPhongMaterial({ color: 0xf2f2f2, specular: 0xffffff, shininess: 100, side: THREE.DoubleSide, map: new THREE.TextureLoader().load("img/white.png") }),
                selected: new THREE.MeshPhongMaterial({ color: 0xf2f2f2, specular: 0xffffff, shininess: 100, side: THREE.DoubleSide, map: new THREE.TextureLoader().load("img/wood.jpg") })
            },
            pons: {
                black: new THREE.MeshPhongMaterial({ color: 0x999999, specular: 0xffffff, map: new THREE.TextureLoader().load("img/text.jpg") }),
                white: new THREE.MeshPhongMaterial({ color: 0xf2f2f2, specular: 0xffffff, map: new THREE.TextureLoader().load("img/text2.png") }),
                selected: new THREE.MeshPhongMaterial({ color: 0xff0000, specular: 0xffffff })
            }

        }

        this.camera.position.set(0, 45, 0)
        this.camera.lookAt(this.scene.position)
        // this.camera.lookAt(new THREE.Vector3(10, 0, 10))

        let frontLight = new Light(0xffffff, 28, 20, 28);
        let backLight = new Light(0xffffff, -28, 20, -28);
        this.scene.add(frontLight.get(), backLight.get())

        // this.axes = new THREE.AxesHelper(1000)
        // this.scene.add(this.axes)

        this.table = []
        this.board = []

        this.render();
        window.addEventListener('resize', this.resize);

        this.renderBoard()
        this.renderPonTable()
        this.renderPons()

        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2()

        document.onmousedown = this.raycast

    }

    render = () => {
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);

        TWEEN.update();

        console.log("rendering scene & camera")
    }

    resize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setCamera = (z) => {
        this.camera.position.set(0, 45, z)
        this.camera.lookAt(this.scene.position)
        this.camera.updateProjectionMatrix();
        console.log(this.camera, this.camera.position)
    }

    renderBoard = () => {

        let parent = new THREE.Object3D();
        parent.name = 'parentalObjectForTiles'

        for (let x = 0; x < 8; x++) {
            this.board[x] = []
            for (let y = 0; y < 8; y++) {
                this.board[x][y] = 0;
                let field = new Cube(2, 1, 2);
                field.name = 'tile-' + x + '-' + y
                field.position.set(2 * x, 0, 2 * y);
                if (x % 2 == 0 && y % 2 == 1) { field.material = this.materials.tiles.black; this.board[x][y] = 1 }
                if (x % 2 == 1 && y % 2 == 0) { field.material = this.materials.tiles.black; this.board[x][y] = 1 }
                parent.add(field);

                parent.position.set(-((2 * x) / 2), 0, -((2 * y) / 2));
            }
        }
        this.scene.add(parent)
    }

    renderPonTable = () => {
        for (let x = 0; x < 8; x++) {
            this.table[x] = []
            for (let y = 0; y < 8; y++) {
                if ((y == 0 && x % 2 == 1) || (y == 1 && x % 2 == 0)) {
                    this.table[x][y] = 1 //define white pons at start
                } else if ((y == 6 && x % 2 == 1) || (y == 7 && x % 2 == 0)) {
                    this.table[x][y] = 2 //define black pons at start
                } else {
                    this.table[x][y] = 0 //define empty field
                }
            }
        }
    }

    renderPons = () => {

        let parent = new THREE.Object3D();
        parent.name = 'parentalObjectForPons'

        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                if (this.table[x][y] == 1 || this.table[x][y] == 2) {
                    let pionek = new Pon();
                    pionek.position.set(2 * x, 1, 2 * y);
                    if (this.table[x][y] == 1) { pionek.material = this.materials.pons.white; pionek.name = 'pon-w-' + x + '-' + y }
                    if (this.table[x][y] == 2) { pionek.material = this.materials.pons.black; pionek.name = 'pon-b-' + x + '-' + y }
                    parent.add(pionek)
                }
                parent.position.set(-((2 * x) / 2), 0, -((2 * y) / 2));
            }
        }

        this.scene.add(parent)

        console.table(this.table)
    }

    raycast = (event) => {

        this.mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
        this.mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseVector, this.camera);

        const intersects = this.raycaster.intersectObjects(this.scene.children);
        console.log(intersects.length)

        let parentalObjectForPons;
        this.scene.children.forEach(child => {
            if (child.name == 'parentalObjectForPons') {
                parentalObjectForPons = child.children
            }
        })

        parentalObjectForPons.forEach(pon => {
            if (pon.name.charAt(4) == 'b') pon.material = this.materials.pons.black
            if (pon.name.charAt(4) == 'w') pon.material = this.materials.pons.white
        })

        let parentalObjectForTiles;
        this.scene.children.forEach(child => {
            if (child.name == 'parentalObjectForTiles') {
                parentalObjectForTiles = child.children
            }
        })

        parentalObjectForTiles.forEach(tile => {
            let position = tile.name.split('-')
            if (this.board[position[1]][position[2]] == 1) tile.material = this.materials.tiles.black
            if (this.board[position[1]][position[2]] == 0) tile.material = this.materials.tiles.white
        })

        if (intersects.length > 0) {

            if (intersects[0].object.name.startsWith('pon')) {
                this.ponSelection(intersects[0].object);
            }

            if (intersects[0].object.name.startsWith('tile')) {
                this.playerMovement(intersects[0].object);
            }
            // intersects[0].object.position.z += 2
        }
    }

    setColor = (color) => {
        this.color = color;
    }

    ponSelection = (pon) => {
        if (this.color.charAt(0) == pon.name.charAt(4)) {
            console.log(this.color, pon.name)

            pon.material = this.materials.pons.selected;
            this.selectPon(pon)
            this.highlightTiles(pon)
        }

    }

    playerMovement = (selectedTile) => {
        if (this.selectedPon != null && this.selectPon != undefined) {
            console.log(this.selectedPon.name)
            let selectedTilePosition = selectedTile.name.split('-')
            let pon = this.selectedPon
            // pon.name.charAt(6) pon.name.charAt(8) // [x-axis, z-axis]            

            let parentalObjectForTiles;
            this.scene.children.forEach(child => {
                if (child.name == 'parentalObjectForTiles') {
                    parentalObjectForTiles = child.children
                }
            })

            let ponX = parseInt(pon.name.charAt(6))
            let ponZ = parseInt(pon.name.charAt(8))

            parentalObjectForTiles.forEach(tile => {
                let tilePosition = tile.name.split('-')
                if (this.board[tilePosition[1]][tilePosition[2]] == 1) {
                    if (tilePosition[1] == selectedTilePosition[1] && tilePosition[2] == selectedTilePosition[2]) {
                        if (this.table[tilePosition[1]][tilePosition[2]] == 0) {
                            this.table[ponX][ponZ] = 0
                            if (this.color.startsWith('w')) this.table[tilePosition[1]][tilePosition[2]] = 1
                            if (this.color.startsWith('b')) this.table[tilePosition[1]][tilePosition[2]] = 2
                            // pon.position.x = selectedTilePosition[1] * 2
                            // pon.position.z = selectedTilePosition[2] * 2

                            let anim = new TWEEN.Tween(pon.position).to({ x: selectedTilePosition[1] * 2, z: selectedTilePosition[2] * 2 }, 500).repeat(0).easing(TWEEN.Easing.Bounce.Out).onUpdate(() => { console.log(pon.position) }).onComplete(() => { console.log("koniec animacji") })
                            anim.start()
                            let newname = pon.name.substr(0, 6) + tilePosition[1] + '-' + tilePosition[2]
                            pon.name = newname
                            console.log(pon.name)
                            this.selectedPon = null

                            console.table(this.table)
                            console.log({
                                pon: { x: pon.name.charAt(6), z: pon.name.charAt(8), realx: pon.position.x, realz: pon.position.z },
                                tile: { x: tilePosition[1], z: tilePosition[2], x2: selectedTilePosition[1], z2: selectedTilePosition[2] },
                            })

                        }

                    }
                }
            })
        }

    }

    selectPon = (pon) => {
        this.selectedPon = pon;
    }

    highlightTiles = (pon) => {
        let parentalObjectForTiles;
        this.scene.children.forEach(child => {
            if (child.name == 'parentalObjectForTiles') {
                parentalObjectForTiles = child.children
            }
        })

        let ponX = parseInt(pon.name.charAt(6))
        let ponZ = parseInt(pon.name.charAt(8))

        parentalObjectForTiles.forEach(tile => {
            let position = tile.name.split('-')
            switch (pon.name.charAt(4)) {
                case 'w':
                    if (this.table[ponX + 1]?.[ponZ + 1] == 0 && this.table[ponX + 1]?.[ponZ + 1] != undefined) {
                        if (ponX + 1 == position[1] && ponZ + 1 == position[2]) { tile.material = this.materials.tiles.selected; }
                    }
                    if (this.table[ponX - 1]?.[ponZ + 1] == 0 && this.table[ponX - 1]?.[ponZ + 1] != undefined) {
                        if (ponX - 1 == position[1] && ponZ + 1 == position[2]) { tile.material = this.materials.tiles.selected; }
                    }

                    break;
                case 'b':
                    if (this.table[ponX + 1]?.[ponZ - 1] == 0 && this.table[ponX + 1]?.[ponZ - 1] != undefined) {
                        if (ponX + 1 == position[1] && ponZ - 1 == position[2]) { tile.material = this.materials.tiles.selected; }
                    }
                    if (this.table[ponX - 1]?.[ponZ - 1] == 0 && this.table[ponX - 1]?.[ponZ - 1] != undefined) {
                        if (ponX - 1 == position[1] && ponZ - 1 == position[2]) { tile.material = this.materials.tiles.selected; }
                    }
                    break;
            }

        })
    }
}

