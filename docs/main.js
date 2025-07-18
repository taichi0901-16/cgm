/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var cannon_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! cannon-es */ "./node_modules/cannon-es/dist/cannon-es.js");



class ThreeJSContainer {
    scene;
    light;
    world;
    fallingObjects = [];
    basketCar;
    basketMesh;
    basketBody;
    motorForce = 0;
    steeringAngle = 0;
    objectSpawnTimer = 0;
    constructor() {
        this.setupKeyboardControls();
    }
    // 画面部分の作成
    createRendererDOM = (width, height, cameraPos) => {
        const renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x87CEEB)); // 空の色
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = three__WEBPACK_IMPORTED_MODULE_1__.PCFSoftShadowMap;
        // カメラの設定
        const camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 0, 0));
        const orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(camera, renderer.domElement);
        this.createScene();
        // レンダーループ
        const render = (time) => {
            orbitControls.update();
            this.updateGame(time);
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    // シーンの作成
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
        // 物理演算世界の作成
        this.world = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.World({ gravity: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0, -9.82, 0) });
        this.world.defaultContactMaterial.friction = 0.4;
        this.world.defaultContactMaterial.restitution = 0.9;
        // グリッド表示
        const gridHelper = new three__WEBPACK_IMPORTED_MODULE_1__.GridHelper(50, 50);
        this.scene.add(gridHelper);
        // 軸表示
        const axesHelper = new three__WEBPACK_IMPORTED_MODULE_1__.AxesHelper(5);
        this.scene.add(axesHelper);
        // ライトの設定
        this.light = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xffffff, 1);
        this.light.position.set(10, 10, 10);
        this.light.castShadow = true;
        this.light.shadow.mapSize.width = 2048;
        this.light.shadow.mapSize.height = 2048;
        this.scene.add(this.light);
        // 地面の作成
        this.createGround();
        // かご車の作成
        this.createBasketCar();
    };
    // 地面の作成
    createGround = () => {
        const groundGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(100, 100);
        const groundMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshLambertMaterial({ color: 0x90EE90 });
        const groundMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(groundGeometry, groundMaterial);
        groundMesh.rotation.x = -Math.PI / 2;
        groundMesh.receiveShadow = true;
        this.scene.add(groundMesh);
        // 物理演算用の地面
        const groundShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Plane();
        const groundBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0 });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromAxisAngle(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(1, 0, 0), -Math.PI / 2);
        groundBody.material = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Material({ restitution: 0.8, friction: 0.5 });
        this.world.addBody(groundBody);
    };
    // かご車の作成
    createBasketCar = () => {
        // 車体の作成
        const chassisBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 5 });
        const chassisShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(2, 0.3, 1.5));
        chassisBody.addShape(chassisShape);
        chassisBody.position.set(0, 1, 0);
        const automobile = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.RigidVehicle({ chassisBody: chassisBody });
        // 車体の表示用メッシュ
        const chassisGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(4, 0.6, 3);
        const chassisMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshLambertMaterial({ color: 0x8B4513 });
        const chassisMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(chassisGeometry, chassisMaterial);
        chassisMesh.castShadow = true;
        this.scene.add(chassisMesh);
        // かごの作成（表示用のみ）
        const basketGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.CylinderGeometry(1.5, 1.5, 2, 16, 1, true);
        const basketMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshLambertMaterial({
            color: 0x654321,
            side: three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide,
            transparent: true,
            opacity: 0.7
        });
        this.basketMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(basketGeometry, basketMaterial);
        this.basketMesh.position.set(0, 1.5, 0);
        this.scene.add(this.basketMesh);
        // かごの物理演算用（底面と側面を別々に作成）
        const basketRadius = 1.5;
        const basketHeight = 2;
        const wallThickness = 0.1;
        // かごの底面
        const basketBottomShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Cylinder(basketRadius, basketRadius, wallThickness, 16);
        chassisBody.addShape(basketBottomShape, new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0, 1.5 - basketHeight / 2, 0));
        // かごの側面（複数の薄い壁で円形に配置）
        const numWalls = 16;
        for (let i = 0; i < numWalls; i++) {
            const angle = (i / numWalls) * Math.PI * 2;
            const x = Math.cos(angle) * (basketRadius - wallThickness / 2);
            const z = Math.sin(angle) * (basketRadius - wallThickness / 2);
            const wallShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(wallThickness / 2, basketHeight / 2, wallThickness / 2));
            const wallPosition = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(x, 1.5, z);
            chassisBody.addShape(wallShape, wallPosition);
        }
        // 車輪の作成
        const wheels = [];
        const wheelPositions = [
            new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(-1.5, 0, 1.8),
            new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(-1.5, 0, -1.8),
            new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(1.5, 0, 1.8),
            new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(1.5, 0, -1.8)
        ];
        for (let i = 0; i < 4; i++) {
            const wheelRadius = 0.5;
            const wheelShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Sphere(wheelRadius);
            const wheelBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 1 });
            wheelBody.addShape(wheelShape);
            wheelBody.angularDamping = 0.4;
            const wheelGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.SphereGeometry(wheelRadius);
            const wheelMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshLambertMaterial({ color: 0x333333 });
            const wheelMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(wheelGeometry, wheelMaterial);
            wheelMesh.castShadow = true;
            this.scene.add(wheelMesh);
            automobile.addWheel({
                body: wheelBody,
                position: wheelPositions[i]
            });
            wheels.push({
                mesh: wheelMesh,
                body: wheelBody
            });
        }
        // 車体を物理空間に追加
        automobile.addToWorld(this.world);
        // basketBodyは独立した物理体として作成しない
        this.basketBody = chassisBody; // 車体と同じ物理体を参照
        this.basketCar = {
            chassisMesh,
            chassisBody,
            wheels,
            automobile
        };
    };
    // 落下物体の作成
    createFallingObject = () => {
        const shapes = ['box', 'sphere', 'cylinder'];
        const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
        let geometry;
        let shape;
        switch (shapeType) {
            case 'box':
                const size = 0.3 + Math.random() * 0.2;
                geometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(size, size, size);
                shape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(size / 2, size / 2, size / 2));
                break;
            case 'sphere':
                const radius = 0.2 + Math.random() * 0.3;
                geometry = new three__WEBPACK_IMPORTED_MODULE_1__.SphereGeometry(radius);
                shape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Sphere(radius);
                break;
            case 'cylinder':
                const cylRadius = 0.2 + Math.random() * 0.2;
                const cylHeight = 0.4 + Math.random() * 0.4;
                geometry = new three__WEBPACK_IMPORTED_MODULE_1__.CylinderGeometry(cylRadius, cylRadius, cylHeight);
                shape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Cylinder(cylRadius, cylRadius, cylHeight, 8);
                break;
        }
        const material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshLambertMaterial({
            color: new three__WEBPACK_IMPORTED_MODULE_1__.Color().setHSL(Math.random(), 0.7, 0.5)
        });
        const mesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(geometry, material);
        mesh.castShadow = true;
        // ランダムな位置から落下
        const x = (Math.random() - 0.5) * 30;
        const z = (Math.random() - 0.5) * 30;
        const y = 15 + Math.random() * 5;
        mesh.position.set(x, y, z);
        this.scene.add(mesh);
        // 物理演算用のボディ
        const body = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 1 });
        body.addShape(shape);
        body.position.set(x, y, z);
        body.material = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Material({ restitution: 0.8, friction: 0.3 });
        this.world.addBody(body);
        this.fallingObjects.push({ mesh, body });
    };
    // キーボード制御の設定
    setupKeyboardControls = () => {
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.motorForce = 15;
                    break;
                case 'ArrowDown':
                    this.motorForce = -15;
                    break;
                case 'ArrowLeft':
                    this.steeringAngle = 0.5;
                    break;
                case 'ArrowRight':
                    this.steeringAngle = -0.5;
                    break;
            }
        });
        document.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                case 'ArrowDown':
                    this.motorForce = 0;
                    break;
                case 'ArrowLeft':
                case 'ArrowRight':
                    this.steeringAngle = 0;
                    break;
            }
        });
    };
    // ゲームの更新
    updateGame = (time) => {
        // 物理演算の実行
        this.world.fixedStep();
        // 落下物体の定期生成
        this.objectSpawnTimer += 16;
        if (this.objectSpawnTimer > 1000) { // 1秒間隔
            // 2個同時に生成
            for (let i = 0; i < 2; i++) {
                this.createFallingObject();
            }
            this.objectSpawnTimer = 0;
        }
        // 車の制御
        this.basketCar.automobile.setWheelForce(this.motorForce, 0);
        this.basketCar.automobile.setWheelForce(this.motorForce, 1);
        this.basketCar.automobile.setSteeringValue(this.steeringAngle, 0);
        this.basketCar.automobile.setSteeringValue(this.steeringAngle, 1);
        // 車体の位置更新
        this.basketCar.chassisMesh.position.set(this.basketCar.chassisBody.position.x, this.basketCar.chassisBody.position.y, this.basketCar.chassisBody.position.z);
        this.basketCar.chassisMesh.quaternion.set(this.basketCar.chassisBody.quaternion.x, this.basketCar.chassisBody.quaternion.y, this.basketCar.chassisBody.quaternion.z, this.basketCar.chassisBody.quaternion.w);
        // かごの位置更新（車体と同じ位置に固定）
        this.basketMesh.position.set(this.basketBody.position.x, this.basketBody.position.y + 1.5, this.basketBody.position.z);
        this.basketMesh.quaternion.set(this.basketBody.quaternion.x, this.basketBody.quaternion.y, this.basketBody.quaternion.z, this.basketBody.quaternion.w);
        // 車輪の位置更新
        this.basketCar.wheels.forEach(wheel => {
            wheel.mesh.position.set(wheel.body.position.x, wheel.body.position.y, wheel.body.position.z);
            wheel.mesh.quaternion.set(wheel.body.quaternion.x, wheel.body.quaternion.y, wheel.body.quaternion.z, wheel.body.quaternion.w);
        });
        // 落下物体の位置更新
        this.fallingObjects.forEach(obj => {
            obj.mesh.position.set(obj.body.position.x, obj.body.position.y, obj.body.position.z);
            obj.mesh.quaternion.set(obj.body.quaternion.x, obj.body.quaternion.y, obj.body.quaternion.z, obj.body.quaternion.w);
        });
        // 地面に落ちた物体の削除
        this.fallingObjects = this.fallingObjects.filter(obj => {
            if (obj.body.position.y < -5) {
                this.scene.remove(obj.mesh);
                this.world.removeBody(obj.body);
                return false;
            }
            return true;
        });
    };
}
// 初期化
window.addEventListener("DOMContentLoaded", init);
function init() {
    const container = new ThreeJSContainer();
    const viewport = container.createRendererDOM(800, 600, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(10, 8, 10));
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_cannon-es_dist_cannon-es_js-node_modules_three_examples_jsm_controls_Orb-e58bd2"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErQjtBQUMyQztBQUN0QztBQUVwQyxNQUFNLGdCQUFnQjtJQUNWLEtBQUssQ0FBYztJQUNuQixLQUFLLENBQWM7SUFDbkIsS0FBSyxDQUFlO0lBQ3BCLGNBQWMsR0FBOEMsRUFBRSxDQUFDO0lBQy9ELFNBQVMsQ0FRZjtJQUNNLFVBQVUsQ0FBYTtJQUN2QixVQUFVLENBQWM7SUFDeEIsVUFBVSxHQUFXLENBQUMsQ0FBQztJQUN2QixhQUFhLEdBQVcsQ0FBQyxDQUFDO0lBQzFCLGdCQUFnQixHQUFXLENBQUMsQ0FBQztJQUVyQztRQUNJLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFRCxVQUFVO0lBQ0gsaUJBQWlCLEdBQUcsQ0FBQyxLQUFhLEVBQUUsTUFBYyxFQUFFLFNBQXdCLEVBQUUsRUFBRTtRQUNuRixNQUFNLFFBQVEsR0FBRyxJQUFJLGdEQUFtQixFQUFFLENBQUM7UUFDM0MsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDaEMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLHdDQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU07UUFDekQsUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ2xDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLG1EQUFzQixDQUFDO1FBRWpELFNBQVM7UUFDVCxNQUFNLE1BQU0sR0FBRyxJQUFJLG9EQUF1QixDQUFDLEVBQUUsRUFBRSxLQUFLLEdBQUcsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMxRSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksMENBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFMUMsTUFBTSxhQUFhLEdBQUcsSUFBSSxvRkFBYSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFckUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRW5CLFVBQVU7UUFDVixNQUFNLE1BQU0sR0FBeUIsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUMxQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QixRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDcEMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUNELHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlCLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7UUFDNUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUMxQyxPQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUM7SUFDL0IsQ0FBQztJQUVELFNBQVM7SUFDRCxXQUFXLEdBQUcsR0FBRyxFQUFFO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSx3Q0FBVyxFQUFFLENBQUM7UUFFL0IsWUFBWTtRQUNaLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSw0Q0FBWSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksMkNBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7UUFFcEQsU0FBUztRQUNULE1BQU0sVUFBVSxHQUFHLElBQUksNkNBQWdCLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTNCLE1BQU07UUFDTixNQUFNLFVBQVUsR0FBRyxJQUFJLDZDQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTNCLFNBQVM7UUFDVCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksbURBQXNCLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUM3QixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUN2QyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUN4QyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFM0IsUUFBUTtRQUNSLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVwQixTQUFTO1FBQ1QsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxRQUFRO0lBQ0EsWUFBWSxHQUFHLEdBQUcsRUFBRTtRQUN4QixNQUFNLGNBQWMsR0FBRyxJQUFJLGdEQUFtQixDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN6RCxNQUFNLGNBQWMsR0FBRyxJQUFJLHNEQUF5QixDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDMUUsTUFBTSxVQUFVLEdBQUcsSUFBSSx1Q0FBVSxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUNsRSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLFVBQVUsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTNCLFdBQVc7UUFDWCxNQUFNLFdBQVcsR0FBRyxJQUFJLDRDQUFZLEVBQUUsQ0FBQztRQUN2QyxNQUFNLFVBQVUsR0FBRyxJQUFJLDJDQUFXLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoRCxVQUFVLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2pDLFVBQVUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsSUFBSSwyQ0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRS9FLFVBQVUsQ0FBQyxRQUFRLEdBQUcsSUFBSSwrQ0FBZSxDQUFDLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUUvRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsU0FBUztJQUNELGVBQWUsR0FBRyxHQUFHLEVBQUU7UUFDM0IsUUFBUTtRQUNSLE1BQU0sV0FBVyxHQUFHLElBQUksMkNBQVcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sWUFBWSxHQUFHLElBQUksMENBQVUsQ0FBQyxJQUFJLDJDQUFXLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLFdBQVcsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbkMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVsQyxNQUFNLFVBQVUsR0FBRyxJQUFJLG1EQUFtQixDQUFDLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFFekUsYUFBYTtRQUNiLE1BQU0sZUFBZSxHQUFHLElBQUksOENBQWlCLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN6RCxNQUFNLGVBQWUsR0FBRyxJQUFJLHNEQUF5QixDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDM0UsTUFBTSxXQUFXLEdBQUcsSUFBSSx1Q0FBVSxDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUNyRSxXQUFXLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUU1QixlQUFlO1FBQ2YsTUFBTSxjQUFjLEdBQUcsSUFBSSxtREFBc0IsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVFLE1BQU0sY0FBYyxHQUFHLElBQUksc0RBQXlCLENBQUM7WUFDakQsS0FBSyxFQUFFLFFBQVE7WUFDZixJQUFJLEVBQUUsNkNBQWdCO1lBQ3RCLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLE9BQU8sRUFBRSxHQUFHO1NBQ2YsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLHVDQUFVLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVoQyx3QkFBd0I7UUFDeEIsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDO1FBQ3pCLE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBQztRQUN2QixNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUM7UUFFMUIsUUFBUTtRQUNSLE1BQU0saUJBQWlCLEdBQUcsSUFBSSwrQ0FBZSxDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdGLFdBQVcsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsSUFBSSwyQ0FBVyxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsWUFBWSxHQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXJGLHNCQUFzQjtRQUN0QixNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDcEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMvQixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUMzQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLGFBQWEsR0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3RCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLGFBQWEsR0FBQyxDQUFDLENBQUMsQ0FBQztZQUU3RCxNQUFNLFNBQVMsR0FBRyxJQUFJLDBDQUFVLENBQUMsSUFBSSwyQ0FBVyxDQUFDLGFBQWEsR0FBQyxDQUFDLEVBQUUsWUFBWSxHQUFDLENBQUMsRUFBRSxhQUFhLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwRyxNQUFNLFlBQVksR0FBRyxJQUFJLDJDQUFXLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNoRCxXQUFXLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztTQUNqRDtRQUVELFFBQVE7UUFDUixNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDbEIsTUFBTSxjQUFjLEdBQUc7WUFDbkIsSUFBSSwyQ0FBVyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUM7WUFDN0IsSUFBSSwyQ0FBVyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztZQUM5QixJQUFJLDJDQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUM7WUFDNUIsSUFBSSwyQ0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUM7U0FDaEMsQ0FBQztRQUVGLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDeEIsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDO1lBQ3hCLE1BQU0sVUFBVSxHQUFHLElBQUksNkNBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNsRCxNQUFNLFNBQVMsR0FBRyxJQUFJLDJDQUFXLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMvQyxTQUFTLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQy9CLFNBQVMsQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO1lBRS9CLE1BQU0sYUFBYSxHQUFHLElBQUksaURBQW9CLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDNUQsTUFBTSxhQUFhLEdBQUcsSUFBSSxzREFBeUIsQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ3pFLE1BQU0sU0FBUyxHQUFHLElBQUksdUNBQVUsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDL0QsU0FBUyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFMUIsVUFBVSxDQUFDLFFBQVEsQ0FBQztnQkFDaEIsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7YUFDOUIsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDUixJQUFJLEVBQUUsU0FBUztnQkFDZixJQUFJLEVBQUUsU0FBUzthQUNsQixDQUFDLENBQUM7U0FDTjtRQUVELGFBQWE7UUFDYixVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVsQyw2QkFBNkI7UUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUMsQ0FBQyxjQUFjO1FBRTdDLElBQUksQ0FBQyxTQUFTLEdBQUc7WUFDYixXQUFXO1lBQ1gsV0FBVztZQUNYLE1BQU07WUFDTixVQUFVO1NBQ2IsQ0FBQztJQUNOLENBQUM7SUFFRCxVQUFVO0lBQ0YsbUJBQW1CLEdBQUcsR0FBRyxFQUFFO1FBQy9CLE1BQU0sTUFBTSxHQUFHLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM3QyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFcEUsSUFBSSxRQUE4QixDQUFDO1FBQ25DLElBQUksS0FBbUIsQ0FBQztRQUV4QixRQUFRLFNBQVMsRUFBRTtZQUNmLEtBQUssS0FBSztnQkFDTixNQUFNLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQztnQkFDdkMsUUFBUSxHQUFHLElBQUksOENBQWlCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDbkQsS0FBSyxHQUFHLElBQUksMENBQVUsQ0FBQyxJQUFJLDJDQUFXLENBQUMsSUFBSSxHQUFDLENBQUMsRUFBRSxJQUFJLEdBQUMsQ0FBQyxFQUFFLElBQUksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRSxNQUFNO1lBQ1YsS0FBSyxRQUFRO2dCQUNULE1BQU0sTUFBTSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDO2dCQUN6QyxRQUFRLEdBQUcsSUFBSSxpREFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDNUMsS0FBSyxHQUFHLElBQUksNkNBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbEMsTUFBTTtZQUNWLEtBQUssVUFBVTtnQkFDWCxNQUFNLFNBQVMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQztnQkFDNUMsTUFBTSxTQUFTLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUM7Z0JBQzVDLFFBQVEsR0FBRyxJQUFJLG1EQUFzQixDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQ3ZFLEtBQUssR0FBRyxJQUFJLCtDQUFlLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hFLE1BQU07U0FDYjtRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksc0RBQXlCLENBQUM7WUFDM0MsS0FBSyxFQUFFLElBQUksd0NBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztTQUMzRCxDQUFDLENBQUM7UUFDSCxNQUFNLElBQUksR0FBRyxJQUFJLHVDQUFVLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBRXZCLGNBQWM7UUFDZCxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDckMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRWpDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFckIsWUFBWTtRQUNaLE1BQU0sSUFBSSxHQUFHLElBQUksMkNBQVcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUzQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksK0NBQWUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFFekUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFekIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsYUFBYTtJQUNMLHFCQUFxQixHQUFHLEdBQUcsRUFBRTtRQUNqQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDM0MsUUFBUSxLQUFLLENBQUMsR0FBRyxFQUFFO2dCQUNmLEtBQUssU0FBUztvQkFDVixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztvQkFDckIsTUFBTTtnQkFDVixLQUFLLFdBQVc7b0JBQ1osSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsQ0FBQztvQkFDdEIsTUFBTTtnQkFDVixLQUFLLFdBQVc7b0JBQ1osSUFBSSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUM7b0JBQ3pCLE1BQU07Z0JBQ1YsS0FBSyxZQUFZO29CQUNiLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUM7b0JBQzFCLE1BQU07YUFDYjtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ3pDLFFBQVEsS0FBSyxDQUFDLEdBQUcsRUFBRTtnQkFDZixLQUFLLFNBQVMsQ0FBQztnQkFDZixLQUFLLFdBQVc7b0JBQ1osSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7b0JBQ3BCLE1BQU07Z0JBQ1YsS0FBSyxXQUFXLENBQUM7Z0JBQ2pCLEtBQUssWUFBWTtvQkFDYixJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztvQkFDdkIsTUFBTTthQUNiO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsU0FBUztJQUNELFVBQVUsR0FBRyxDQUFDLElBQVksRUFBRSxFQUFFO1FBQ2xDLFVBQVU7UUFDVixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBRXZCLFlBQVk7UUFDWixJQUFJLENBQUMsZ0JBQWdCLElBQUksRUFBRSxDQUFDO1FBQzVCLElBQUksSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksRUFBRSxFQUFFLE9BQU87WUFDdkMsVUFBVTtZQUNWLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2FBQzlCO1lBQ0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQztTQUM3QjtRQUVELE9BQU87UUFDUCxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbEUsVUFBVTtRQUNWLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQ3hDLENBQUM7UUFDRixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUNyQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUN2QyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUN2QyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUN2QyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUMxQyxDQUFDO1FBRUYsc0JBQXNCO1FBQ3RCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUNoQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQzdCLENBQUM7UUFDRixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQzFCLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsRUFDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUM1QixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQzVCLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FDL0IsQ0FBQztRQUVGLFVBQVU7UUFDVixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDbEMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUNuQixLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQ3JCLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFDckIsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUN4QixDQUFDO1lBQ0YsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUNyQixLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQ3ZCLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFDdkIsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUN2QixLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQzFCLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztRQUVILFlBQVk7UUFDWixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUM5QixHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQ2pCLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFDbkIsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUNuQixHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQ3RCLENBQUM7WUFDRixHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQ25CLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFDckIsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUNyQixHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQ3JCLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FDeEIsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO1FBRUgsY0FBYztRQUNkLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDbkQsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNoQyxPQUFPLEtBQUssQ0FBQzthQUNoQjtZQUNELE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBRUQsTUFBTTtBQUNOLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUVsRCxTQUFTLElBQUk7SUFDVCxNQUFNLFNBQVMsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7SUFDekMsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSwwQ0FBYSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNyRixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN4QyxDQUFDOzs7Ozs7O1VDdFlEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7Ozs7V0N6QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSwrQkFBK0Isd0NBQXdDO1dBQ3ZFO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUJBQWlCLHFCQUFxQjtXQUN0QztXQUNBO1dBQ0Esa0JBQWtCLHFCQUFxQjtXQUN2QztXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9sc1wiO1xuaW1wb3J0ICogYXMgQ0FOTk9OIGZyb20gJ2Nhbm5vbi1lcyc7XG5cbmNsYXNzIFRocmVlSlNDb250YWluZXIge1xuICAgIHByaXZhdGUgc2NlbmU6IFRIUkVFLlNjZW5lO1xuICAgIHByaXZhdGUgbGlnaHQ6IFRIUkVFLkxpZ2h0O1xuICAgIHByaXZhdGUgd29ybGQ6IENBTk5PTi5Xb3JsZDtcbiAgICBwcml2YXRlIGZhbGxpbmdPYmplY3RzOiB7IG1lc2g6IFRIUkVFLk1lc2g7IGJvZHk6IENBTk5PTi5Cb2R5IH1bXSA9IFtdO1xuICAgIHByaXZhdGUgYmFza2V0Q2FyOiB7XG4gICAgICAgIGNoYXNzaXNNZXNoOiBUSFJFRS5NZXNoO1xuICAgICAgICBjaGFzc2lzQm9keTogQ0FOTk9OLkJvZHk7XG4gICAgICAgIHdoZWVsczoge1xuICAgICAgICAgICAgbWVzaDogVEhSRUUuTWVzaDtcbiAgICAgICAgICAgIGJvZHk6IENBTk5PTi5Cb2R5O1xuICAgICAgICB9W107XG4gICAgICAgIGF1dG9tb2JpbGU6IENBTk5PTi5SaWdpZFZlaGljbGU7XG4gICAgfTtcbiAgICBwcml2YXRlIGJhc2tldE1lc2g6IFRIUkVFLk1lc2g7XG4gICAgcHJpdmF0ZSBiYXNrZXRCb2R5OiBDQU5OT04uQm9keTtcbiAgICBwcml2YXRlIG1vdG9yRm9yY2U6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBzdGVlcmluZ0FuZ2xlOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgb2JqZWN0U3Bhd25UaW1lcjogbnVtYmVyID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnNldHVwS2V5Ym9hcmRDb250cm9scygpO1xuICAgIH1cblxuICAgIC8vIOeUu+mdoumDqOWIhuOBruS9nOaIkFxuICAgIHB1YmxpYyBjcmVhdGVSZW5kZXJlckRPTSA9ICh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgY2FtZXJhUG9zOiBUSFJFRS5WZWN0b3IzKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbiAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHg4N0NFRUIpKTsgLy8g56m644Gu6ImyXG4gICAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgcmVuZGVyZXIuc2hhZG93TWFwLnR5cGUgPSBUSFJFRS5QQ0ZTb2Z0U2hhZG93TWFwO1xuXG4gICAgICAgIC8vIOOCq+ODoeODqeOBruioreWumlxuICAgICAgICBjb25zdCBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpZHRoIC8gaGVpZ2h0LCAwLjEsIDEwMDApO1xuICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weShjYW1lcmFQb3MpO1xuICAgICAgICBjYW1lcmEubG9va0F0KG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApKTtcblxuICAgICAgICBjb25zdCBvcmJpdENvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgICAgICB0aGlzLmNyZWF0ZVNjZW5lKCk7XG5cbiAgICAgICAgLy8g44Os44Oz44OA44O844Or44O844OXXG4gICAgICAgIGNvbnN0IHJlbmRlcjogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xuICAgICAgICAgICAgb3JiaXRDb250cm9scy51cGRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR2FtZSh0aW1lKTtcbiAgICAgICAgICAgIHJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCBjYW1lcmEpO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG5cbiAgICAgICAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5jc3NGbG9hdCA9IFwibGVmdFwiO1xuICAgICAgICByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLm1hcmdpbiA9IFwiMTBweFwiO1xuICAgICAgICByZXR1cm4gcmVuZGVyZXIuZG9tRWxlbWVudDtcbiAgICB9XG5cbiAgICAvLyDjgrfjg7zjg7Pjga7kvZzmiJBcbiAgICBwcml2YXRlIGNyZWF0ZVNjZW5lID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbiAgICAgICAgLy8g54mp55CG5ryU566X5LiW55WM44Gu5L2c5oiQXG4gICAgICAgIHRoaXMud29ybGQgPSBuZXcgQ0FOTk9OLldvcmxkKHsgZ3Jhdml0eTogbmV3IENBTk5PTi5WZWMzKDAsIC05LjgyLCAwKSB9KTtcbiAgICAgICAgdGhpcy53b3JsZC5kZWZhdWx0Q29udGFjdE1hdGVyaWFsLmZyaWN0aW9uID0gMC40O1xuICAgICAgICB0aGlzLndvcmxkLmRlZmF1bHRDb250YWN0TWF0ZXJpYWwucmVzdGl0dXRpb24gPSAwLjk7XG5cbiAgICAgICAgLy8g44Kw44Oq44OD44OJ6KGo56S6XG4gICAgICAgIGNvbnN0IGdyaWRIZWxwZXIgPSBuZXcgVEhSRUUuR3JpZEhlbHBlcig1MCwgNTApO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChncmlkSGVscGVyKTtcblxuICAgICAgICAvLyDou7jooajnpLpcbiAgICAgICAgY29uc3QgYXhlc0hlbHBlciA9IG5ldyBUSFJFRS5BeGVzSGVscGVyKDUpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChheGVzSGVscGVyKTtcblxuICAgICAgICAvLyDjg6njgqTjg4jjga7oqK3lrppcbiAgICAgICAgdGhpcy5saWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAxKTtcbiAgICAgICAgdGhpcy5saWdodC5wb3NpdGlvbi5zZXQoMTAsIDEwLCAxMCk7XG4gICAgICAgIHRoaXMubGlnaHQuY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgICAgIHRoaXMubGlnaHQuc2hhZG93Lm1hcFNpemUud2lkdGggPSAyMDQ4O1xuICAgICAgICB0aGlzLmxpZ2h0LnNoYWRvdy5tYXBTaXplLmhlaWdodCA9IDIwNDg7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMubGlnaHQpO1xuXG4gICAgICAgIC8vIOWcsOmdouOBruS9nOaIkFxuICAgICAgICB0aGlzLmNyZWF0ZUdyb3VuZCgpO1xuXG4gICAgICAgIC8vIOOBi+OBlOi7iuOBruS9nOaIkFxuICAgICAgICB0aGlzLmNyZWF0ZUJhc2tldENhcigpO1xuICAgIH1cblxuICAgIC8vIOWcsOmdouOBruS9nOaIkFxuICAgIHByaXZhdGUgY3JlYXRlR3JvdW5kID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBncm91bmRHZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDEwMCwgMTAwKTtcbiAgICAgICAgY29uc3QgZ3JvdW5kTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7IGNvbG9yOiAweDkwRUU5MCB9KTtcbiAgICAgICAgY29uc3QgZ3JvdW5kTWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdyb3VuZEdlb21ldHJ5LCBncm91bmRNYXRlcmlhbCk7XG4gICAgICAgIGdyb3VuZE1lc2gucm90YXRpb24ueCA9IC1NYXRoLlBJIC8gMjtcbiAgICAgICAgZ3JvdW5kTWVzaC5yZWNlaXZlU2hhZG93ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZ3JvdW5kTWVzaCk7XG5cbiAgICAgICAgLy8g54mp55CG5ryU566X55So44Gu5Zyw6Z2iXG4gICAgICAgIGNvbnN0IGdyb3VuZFNoYXBlID0gbmV3IENBTk5PTi5QbGFuZSgpO1xuICAgICAgICBjb25zdCBncm91bmRCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMCB9KTtcbiAgICAgICAgZ3JvdW5kQm9keS5hZGRTaGFwZShncm91bmRTaGFwZSk7XG4gICAgICAgIGdyb3VuZEJvZHkucXVhdGVybmlvbi5zZXRGcm9tQXhpc0FuZ2xlKG5ldyBDQU5OT04uVmVjMygxLCAwLCAwKSwgLU1hdGguUEkgLyAyKTtcbiAgICAgICAgXG4gICAgICAgIGdyb3VuZEJvZHkubWF0ZXJpYWwgPSBuZXcgQ0FOTk9OLk1hdGVyaWFsKHsgcmVzdGl0dXRpb246IDAuOCwgZnJpY3Rpb246IDAuNSB9KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMud29ybGQuYWRkQm9keShncm91bmRCb2R5KTtcbiAgICB9XG5cbiAgICAvLyDjgYvjgZTou4rjga7kvZzmiJBcbiAgICBwcml2YXRlIGNyZWF0ZUJhc2tldENhciA9ICgpID0+IHtcbiAgICAgICAgLy8g6LuK5L2T44Gu5L2c5oiQXG4gICAgICAgIGNvbnN0IGNoYXNzaXNCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogNSB9KTtcbiAgICAgICAgY29uc3QgY2hhc3Npc1NoYXBlID0gbmV3IENBTk5PTi5Cb3gobmV3IENBTk5PTi5WZWMzKDIsIDAuMywgMS41KSk7XG4gICAgICAgIGNoYXNzaXNCb2R5LmFkZFNoYXBlKGNoYXNzaXNTaGFwZSk7XG4gICAgICAgIGNoYXNzaXNCb2R5LnBvc2l0aW9uLnNldCgwLCAxLCAwKTtcblxuICAgICAgICBjb25zdCBhdXRvbW9iaWxlID0gbmV3IENBTk5PTi5SaWdpZFZlaGljbGUoeyBjaGFzc2lzQm9keTogY2hhc3Npc0JvZHkgfSk7XG5cbiAgICAgICAgLy8g6LuK5L2T44Gu6KGo56S655So44Oh44OD44K344OlXG4gICAgICAgIGNvbnN0IGNoYXNzaXNHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSg0LCAwLjYsIDMpO1xuICAgICAgICBjb25zdCBjaGFzc2lzTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7IGNvbG9yOiAweDhCNDUxMyB9KTtcbiAgICAgICAgY29uc3QgY2hhc3Npc01lc2ggPSBuZXcgVEhSRUUuTWVzaChjaGFzc2lzR2VvbWV0cnksIGNoYXNzaXNNYXRlcmlhbCk7XG4gICAgICAgIGNoYXNzaXNNZXNoLmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChjaGFzc2lzTWVzaCk7XG5cbiAgICAgICAgLy8g44GL44GU44Gu5L2c5oiQ77yI6KGo56S655So44Gu44G/77yJXG4gICAgICAgIGNvbnN0IGJhc2tldEdlb21ldHJ5ID0gbmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkoMS41LCAxLjUsIDIsIDE2LCAxLCB0cnVlKTtcbiAgICAgICAgY29uc3QgYmFza2V0TWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7IFxuICAgICAgICAgICAgY29sb3I6IDB4NjU0MzIxLCBcbiAgICAgICAgICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXG4gICAgICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuN1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5iYXNrZXRNZXNoID0gbmV3IFRIUkVFLk1lc2goYmFza2V0R2VvbWV0cnksIGJhc2tldE1hdGVyaWFsKTtcbiAgICAgICAgdGhpcy5iYXNrZXRNZXNoLnBvc2l0aW9uLnNldCgwLCAxLjUsIDApO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmJhc2tldE1lc2gpO1xuXG4gICAgICAgIC8vIOOBi+OBlOOBrueJqeeQhua8lOeul+eUqO+8iOW6lemdouOBqOWBtOmdouOCkuWIpeOAheOBq+S9nOaIkO+8iVxuICAgICAgICBjb25zdCBiYXNrZXRSYWRpdXMgPSAxLjU7XG4gICAgICAgIGNvbnN0IGJhc2tldEhlaWdodCA9IDI7XG4gICAgICAgIGNvbnN0IHdhbGxUaGlja25lc3MgPSAwLjE7XG4gICAgICAgIFxuICAgICAgICAvLyDjgYvjgZTjga7lupXpnaJcbiAgICAgICAgY29uc3QgYmFza2V0Qm90dG9tU2hhcGUgPSBuZXcgQ0FOTk9OLkN5bGluZGVyKGJhc2tldFJhZGl1cywgYmFza2V0UmFkaXVzLCB3YWxsVGhpY2tuZXNzLCAxNik7XG4gICAgICAgIGNoYXNzaXNCb2R5LmFkZFNoYXBlKGJhc2tldEJvdHRvbVNoYXBlLCBuZXcgQ0FOTk9OLlZlYzMoMCwgMS41IC0gYmFza2V0SGVpZ2h0LzIsIDApKTtcbiAgICAgICAgXG4gICAgICAgIC8vIOOBi+OBlOOBruWBtOmdou+8iOikh+aVsOOBruiWhOOBhOWjgeOBp+WGhuW9ouOBq+mFjee9ru+8iVxuICAgICAgICBjb25zdCBudW1XYWxscyA9IDE2O1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVdhbGxzOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gKGkgLyBudW1XYWxscykgKiBNYXRoLlBJICogMjtcbiAgICAgICAgICAgIGNvbnN0IHggPSBNYXRoLmNvcyhhbmdsZSkgKiAoYmFza2V0UmFkaXVzIC0gd2FsbFRoaWNrbmVzcy8yKTtcbiAgICAgICAgICAgIGNvbnN0IHogPSBNYXRoLnNpbihhbmdsZSkgKiAoYmFza2V0UmFkaXVzIC0gd2FsbFRoaWNrbmVzcy8yKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgd2FsbFNoYXBlID0gbmV3IENBTk5PTi5Cb3gobmV3IENBTk5PTi5WZWMzKHdhbGxUaGlja25lc3MvMiwgYmFza2V0SGVpZ2h0LzIsIHdhbGxUaGlja25lc3MvMikpO1xuICAgICAgICAgICAgY29uc3Qgd2FsbFBvc2l0aW9uID0gbmV3IENBTk5PTi5WZWMzKHgsIDEuNSwgeik7XG4gICAgICAgICAgICBjaGFzc2lzQm9keS5hZGRTaGFwZSh3YWxsU2hhcGUsIHdhbGxQb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDou4rovKrjga7kvZzmiJBcbiAgICAgICAgY29uc3Qgd2hlZWxzID0gW107XG4gICAgICAgIGNvbnN0IHdoZWVsUG9zaXRpb25zID0gW1xuICAgICAgICAgICAgbmV3IENBTk5PTi5WZWMzKC0xLjUsIDAsIDEuOCksXG4gICAgICAgICAgICBuZXcgQ0FOTk9OLlZlYzMoLTEuNSwgMCwgLTEuOCksXG4gICAgICAgICAgICBuZXcgQ0FOTk9OLlZlYzMoMS41LCAwLCAxLjgpLFxuICAgICAgICAgICAgbmV3IENBTk5PTi5WZWMzKDEuNSwgMCwgLTEuOClcbiAgICAgICAgXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgd2hlZWxSYWRpdXMgPSAwLjU7XG4gICAgICAgICAgICBjb25zdCB3aGVlbFNoYXBlID0gbmV3IENBTk5PTi5TcGhlcmUod2hlZWxSYWRpdXMpO1xuICAgICAgICAgICAgY29uc3Qgd2hlZWxCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMSB9KTtcbiAgICAgICAgICAgIHdoZWVsQm9keS5hZGRTaGFwZSh3aGVlbFNoYXBlKTtcbiAgICAgICAgICAgIHdoZWVsQm9keS5hbmd1bGFyRGFtcGluZyA9IDAuNDtcblxuICAgICAgICAgICAgY29uc3Qgd2hlZWxHZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSh3aGVlbFJhZGl1cyk7XG4gICAgICAgICAgICBjb25zdCB3aGVlbE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoeyBjb2xvcjogMHgzMzMzMzMgfSk7XG4gICAgICAgICAgICBjb25zdCB3aGVlbE1lc2ggPSBuZXcgVEhSRUUuTWVzaCh3aGVlbEdlb21ldHJ5LCB3aGVlbE1hdGVyaWFsKTtcbiAgICAgICAgICAgIHdoZWVsTWVzaC5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKHdoZWVsTWVzaCk7XG5cbiAgICAgICAgICAgIGF1dG9tb2JpbGUuYWRkV2hlZWwoe1xuICAgICAgICAgICAgICAgIGJvZHk6IHdoZWVsQm9keSxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogd2hlZWxQb3NpdGlvbnNbaV1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB3aGVlbHMucHVzaCh7XG4gICAgICAgICAgICAgICAgbWVzaDogd2hlZWxNZXNoLFxuICAgICAgICAgICAgICAgIGJvZHk6IHdoZWVsQm9keVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDou4rkvZPjgpLniannkIbnqbrplpPjgavov73liqBcbiAgICAgICAgYXV0b21vYmlsZS5hZGRUb1dvcmxkKHRoaXMud29ybGQpO1xuXG4gICAgICAgIC8vIGJhc2tldEJvZHnjga/ni6znq4vjgZfjgZ/niannkIbkvZPjgajjgZfjgabkvZzmiJDjgZfjgarjgYRcbiAgICAgICAgdGhpcy5iYXNrZXRCb2R5ID0gY2hhc3Npc0JvZHk7IC8vIOi7iuS9k+OBqOWQjOOBmOeJqeeQhuS9k+OCkuWPgueFp1xuXG4gICAgICAgIHRoaXMuYmFza2V0Q2FyID0ge1xuICAgICAgICAgICAgY2hhc3Npc01lc2gsXG4gICAgICAgICAgICBjaGFzc2lzQm9keSxcbiAgICAgICAgICAgIHdoZWVscyxcbiAgICAgICAgICAgIGF1dG9tb2JpbGVcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyDokL3kuIvniankvZPjga7kvZzmiJBcbiAgICBwcml2YXRlIGNyZWF0ZUZhbGxpbmdPYmplY3QgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNoYXBlcyA9IFsnYm94JywgJ3NwaGVyZScsICdjeWxpbmRlciddO1xuICAgICAgICBjb25zdCBzaGFwZVR5cGUgPSBzaGFwZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc2hhcGVzLmxlbmd0aCldO1xuICAgICAgICBcbiAgICAgICAgbGV0IGdlb21ldHJ5OiBUSFJFRS5CdWZmZXJHZW9tZXRyeTtcbiAgICAgICAgbGV0IHNoYXBlOiBDQU5OT04uU2hhcGU7XG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggKHNoYXBlVHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnYm94JzpcbiAgICAgICAgICAgICAgICBjb25zdCBzaXplID0gMC4zICsgTWF0aC5yYW5kb20oKSAqIDAuMjtcbiAgICAgICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeShzaXplLCBzaXplLCBzaXplKTtcbiAgICAgICAgICAgICAgICBzaGFwZSA9IG5ldyBDQU5OT04uQm94KG5ldyBDQU5OT04uVmVjMyhzaXplLzIsIHNpemUvMiwgc2l6ZS8yKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzcGhlcmUnOlxuICAgICAgICAgICAgICAgIGNvbnN0IHJhZGl1cyA9IDAuMiArIE1hdGgucmFuZG9tKCkgKiAwLjM7XG4gICAgICAgICAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkocmFkaXVzKTtcbiAgICAgICAgICAgICAgICBzaGFwZSA9IG5ldyBDQU5OT04uU3BoZXJlKHJhZGl1cyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjeWxpbmRlcic6XG4gICAgICAgICAgICAgICAgY29uc3QgY3lsUmFkaXVzID0gMC4yICsgTWF0aC5yYW5kb20oKSAqIDAuMjtcbiAgICAgICAgICAgICAgICBjb25zdCBjeWxIZWlnaHQgPSAwLjQgKyBNYXRoLnJhbmRvbSgpICogMC40O1xuICAgICAgICAgICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkoY3lsUmFkaXVzLCBjeWxSYWRpdXMsIGN5bEhlaWdodCk7XG4gICAgICAgICAgICAgICAgc2hhcGUgPSBuZXcgQ0FOTk9OLkN5bGluZGVyKGN5bFJhZGl1cywgY3lsUmFkaXVzLCBjeWxIZWlnaHQsIDgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7IFxuICAgICAgICAgICAgY29sb3I6IG5ldyBUSFJFRS5Db2xvcigpLnNldEhTTChNYXRoLnJhbmRvbSgpLCAwLjcsIDAuNSkgXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgbWVzaC5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgIC8vIOODqeODs+ODgOODoOOBquS9jee9ruOBi+OCieiQveS4i1xuICAgICAgICBjb25zdCB4ID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMzA7XG4gICAgICAgIGNvbnN0IHogPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAzMDtcbiAgICAgICAgY29uc3QgeSA9IDE1ICsgTWF0aC5yYW5kb20oKSAqIDU7XG4gICAgICAgIFxuICAgICAgICBtZXNoLnBvc2l0aW9uLnNldCh4LCB5LCB6KTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQobWVzaCk7XG5cbiAgICAgICAgLy8g54mp55CG5ryU566X55So44Gu44Oc44OH44KjXG4gICAgICAgIGNvbnN0IGJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoeyBtYXNzOiAxIH0pO1xuICAgICAgICBib2R5LmFkZFNoYXBlKHNoYXBlKTtcbiAgICAgICAgYm9keS5wb3NpdGlvbi5zZXQoeCwgeSwgeik7XG4gICAgICAgIFxuICAgICAgICBib2R5Lm1hdGVyaWFsID0gbmV3IENBTk5PTi5NYXRlcmlhbCh7IHJlc3RpdHV0aW9uOiAwLjgsIGZyaWN0aW9uOiAwLjMgfSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLndvcmxkLmFkZEJvZHkoYm9keSk7XG5cbiAgICAgICAgdGhpcy5mYWxsaW5nT2JqZWN0cy5wdXNoKHsgbWVzaCwgYm9keSB9KTtcbiAgICB9XG5cbiAgICAvLyDjgq3jg7zjg5zjg7zjg4nliLblvqHjga7oqK3lrppcbiAgICBwcml2YXRlIHNldHVwS2V5Ym9hcmRDb250cm9scyA9ICgpID0+IHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1VwJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3RvckZvcmNlID0gMTU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93RG93bic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW90b3JGb3JjZSA9IC0xNTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dMZWZ0JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGVlcmluZ0FuZ2xlID0gMC41O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1JpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGVlcmluZ0FuZ2xlID0gLTAuNTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93VXAnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93RG93bic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW90b3JGb3JjZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dSaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RlZXJpbmdBbmdsZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyDjgrLjg7zjg6Djga7mm7TmlrBcbiAgICBwcml2YXRlIHVwZGF0ZUdhbWUgPSAodGltZTogbnVtYmVyKSA9PiB7XG4gICAgICAgIC8vIOeJqeeQhua8lOeul+OBruWun+ihjFxuICAgICAgICB0aGlzLndvcmxkLmZpeGVkU3RlcCgpO1xuXG4gICAgICAgIC8vIOiQveS4i+eJqeS9k+OBruWumuacn+eUn+aIkFxuICAgICAgICB0aGlzLm9iamVjdFNwYXduVGltZXIgKz0gMTY7XG4gICAgICAgIGlmICh0aGlzLm9iamVjdFNwYXduVGltZXIgPiAxMDAwKSB7IC8vIDHnp5LplpPpmpRcbiAgICAgICAgICAgIC8vIDLlgIvlkIzmmYLjgavnlJ/miJBcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVGYWxsaW5nT2JqZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm9iamVjdFNwYXduVGltZXIgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g6LuK44Gu5Yi25b6hXG4gICAgICAgIHRoaXMuYmFza2V0Q2FyLmF1dG9tb2JpbGUuc2V0V2hlZWxGb3JjZSh0aGlzLm1vdG9yRm9yY2UsIDApO1xuICAgICAgICB0aGlzLmJhc2tldENhci5hdXRvbW9iaWxlLnNldFdoZWVsRm9yY2UodGhpcy5tb3RvckZvcmNlLCAxKTtcbiAgICAgICAgdGhpcy5iYXNrZXRDYXIuYXV0b21vYmlsZS5zZXRTdGVlcmluZ1ZhbHVlKHRoaXMuc3RlZXJpbmdBbmdsZSwgMCk7XG4gICAgICAgIHRoaXMuYmFza2V0Q2FyLmF1dG9tb2JpbGUuc2V0U3RlZXJpbmdWYWx1ZSh0aGlzLnN0ZWVyaW5nQW5nbGUsIDEpO1xuXG4gICAgICAgIC8vIOi7iuS9k+OBruS9jee9ruabtOaWsFxuICAgICAgICB0aGlzLmJhc2tldENhci5jaGFzc2lzTWVzaC5wb3NpdGlvbi5zZXQoXG4gICAgICAgICAgICB0aGlzLmJhc2tldENhci5jaGFzc2lzQm9keS5wb3NpdGlvbi54LFxuICAgICAgICAgICAgdGhpcy5iYXNrZXRDYXIuY2hhc3Npc0JvZHkucG9zaXRpb24ueSxcbiAgICAgICAgICAgIHRoaXMuYmFza2V0Q2FyLmNoYXNzaXNCb2R5LnBvc2l0aW9uLnpcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5iYXNrZXRDYXIuY2hhc3Npc01lc2gucXVhdGVybmlvbi5zZXQoXG4gICAgICAgICAgICB0aGlzLmJhc2tldENhci5jaGFzc2lzQm9keS5xdWF0ZXJuaW9uLngsXG4gICAgICAgICAgICB0aGlzLmJhc2tldENhci5jaGFzc2lzQm9keS5xdWF0ZXJuaW9uLnksXG4gICAgICAgICAgICB0aGlzLmJhc2tldENhci5jaGFzc2lzQm9keS5xdWF0ZXJuaW9uLnosXG4gICAgICAgICAgICB0aGlzLmJhc2tldENhci5jaGFzc2lzQm9keS5xdWF0ZXJuaW9uLndcbiAgICAgICAgKTtcblxuICAgICAgICAvLyDjgYvjgZTjga7kvY3nva7mm7TmlrDvvIjou4rkvZPjgajlkIzjgZjkvY3nva7jgavlm7rlrprvvIlcbiAgICAgICAgdGhpcy5iYXNrZXRNZXNoLnBvc2l0aW9uLnNldChcbiAgICAgICAgICAgIHRoaXMuYmFza2V0Qm9keS5wb3NpdGlvbi54LFxuICAgICAgICAgICAgdGhpcy5iYXNrZXRCb2R5LnBvc2l0aW9uLnkgKyAxLjUsXG4gICAgICAgICAgICB0aGlzLmJhc2tldEJvZHkucG9zaXRpb24uelxuICAgICAgICApO1xuICAgICAgICB0aGlzLmJhc2tldE1lc2gucXVhdGVybmlvbi5zZXQoXG4gICAgICAgICAgICB0aGlzLmJhc2tldEJvZHkucXVhdGVybmlvbi54LFxuICAgICAgICAgICAgdGhpcy5iYXNrZXRCb2R5LnF1YXRlcm5pb24ueSxcbiAgICAgICAgICAgIHRoaXMuYmFza2V0Qm9keS5xdWF0ZXJuaW9uLnosXG4gICAgICAgICAgICB0aGlzLmJhc2tldEJvZHkucXVhdGVybmlvbi53XG4gICAgICAgICk7XG5cbiAgICAgICAgLy8g6LuK6Lyq44Gu5L2N572u5pu05pawXG4gICAgICAgIHRoaXMuYmFza2V0Q2FyLndoZWVscy5mb3JFYWNoKHdoZWVsID0+IHtcbiAgICAgICAgICAgIHdoZWVsLm1lc2gucG9zaXRpb24uc2V0KFxuICAgICAgICAgICAgICAgIHdoZWVsLmJvZHkucG9zaXRpb24ueCxcbiAgICAgICAgICAgICAgICB3aGVlbC5ib2R5LnBvc2l0aW9uLnksXG4gICAgICAgICAgICAgICAgd2hlZWwuYm9keS5wb3NpdGlvbi56XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgd2hlZWwubWVzaC5xdWF0ZXJuaW9uLnNldChcbiAgICAgICAgICAgICAgICB3aGVlbC5ib2R5LnF1YXRlcm5pb24ueCxcbiAgICAgICAgICAgICAgICB3aGVlbC5ib2R5LnF1YXRlcm5pb24ueSxcbiAgICAgICAgICAgICAgICB3aGVlbC5ib2R5LnF1YXRlcm5pb24ueixcbiAgICAgICAgICAgICAgICB3aGVlbC5ib2R5LnF1YXRlcm5pb24ud1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g6JC95LiL54mp5L2T44Gu5L2N572u5pu05pawXG4gICAgICAgIHRoaXMuZmFsbGluZ09iamVjdHMuZm9yRWFjaChvYmogPT4ge1xuICAgICAgICAgICAgb2JqLm1lc2gucG9zaXRpb24uc2V0KFxuICAgICAgICAgICAgICAgIG9iai5ib2R5LnBvc2l0aW9uLngsXG4gICAgICAgICAgICAgICAgb2JqLmJvZHkucG9zaXRpb24ueSxcbiAgICAgICAgICAgICAgICBvYmouYm9keS5wb3NpdGlvbi56XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgb2JqLm1lc2gucXVhdGVybmlvbi5zZXQoXG4gICAgICAgICAgICAgICAgb2JqLmJvZHkucXVhdGVybmlvbi54LFxuICAgICAgICAgICAgICAgIG9iai5ib2R5LnF1YXRlcm5pb24ueSxcbiAgICAgICAgICAgICAgICBvYmouYm9keS5xdWF0ZXJuaW9uLnosXG4gICAgICAgICAgICAgICAgb2JqLmJvZHkucXVhdGVybmlvbi53XG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyDlnLDpnaLjgavokL3jgaHjgZ/niankvZPjga7liYrpmaRcbiAgICAgICAgdGhpcy5mYWxsaW5nT2JqZWN0cyA9IHRoaXMuZmFsbGluZ09iamVjdHMuZmlsdGVyKG9iaiA9PiB7XG4gICAgICAgICAgICBpZiAob2JqLmJvZHkucG9zaXRpb24ueSA8IC01KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5yZW1vdmUob2JqLm1lc2gpO1xuICAgICAgICAgICAgICAgIHRoaXMud29ybGQucmVtb3ZlQm9keShvYmouYm9keSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLy8g5Yid5pyf5YyWXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgaW5pdCk7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gbmV3IFRocmVlSlNDb250YWluZXIoKTtcbiAgICBjb25zdCB2aWV3cG9ydCA9IGNvbnRhaW5lci5jcmVhdGVSZW5kZXJlckRPTSg4MDAsIDYwMCwgbmV3IFRIUkVFLlZlY3RvcjMoMTAsIDgsIDEwKSk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh2aWV3cG9ydCk7XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc19jYW5ub24tZXNfZGlzdF9jYW5ub24tZXNfanMtbm9kZV9tb2R1bGVzX3RocmVlX2V4YW1wbGVzX2pzbV9jb250cm9sc19PcmItZTU4YmQyXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9