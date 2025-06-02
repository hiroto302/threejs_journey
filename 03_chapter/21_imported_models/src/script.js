import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import GUI from 'lil-gui'
import { mix } from 'three/src/nodes/TSL.js'
import { ConstNode } from 'three/webgpu'

//TODO: draco loader is located in: nodes_modules/three/examples/jsm/draco を static フォルダ内に移動させた

//NOTE: 使用する Model が正しいものかを判別するために、「Three.js Editor」を活用しよう！
// モデルのバイナリファイルを Drag&Dropしてみて！

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */
const gltfLoader = new GLTFLoader()

// Duck
gltfLoader.load(
    "/models/Duck/glTF/Duck.gltf",
    // 各コールバック関数
    (gltf) =>
    {
        // console.log(gltf);
        // scene.add(gltf.scene.children[0])
        console.log("Success Duck")
    },
    () =>
    {
        console.log("Progress")
    },
    () =>
    {
        console.log("error")
    }
)
// Helmet
gltfLoader.load(
    "/models/FlightHelmet/glTF/FlightHelmet.gltf",
    (gltf) =>
    {
        //NOTE: ヘルメットの構成を確認すると、Mesh の Array の要素が5つある。これらのChildren全てを追加して表示する必要がある！
        console.log(gltf.scene)

        // scene.add(gltf.scene.children[0])

        // for (const child of gltf.scene.children)
        // {
        //     scene.add(child)
        // }

        // NOTE: 全ての構成要素を追加していく！
        // while(gltf.scene.children[0])
        // {
        //     // 追加していく毎に、modelを構成してるArrayのChildrenの要素は小さくなっていく　
        //     scene.add(gltf.scene.children[0])
        // }

        // const children = [...gltf.scene.children]
        // console.log(children)
        // for(const child of children)
        // {
        //     scene.add(child)
        // }

        //NOTE: 結局、GroupをSceneに追加することが一番シンプルで良い
        // scene.add(gltf.scene)


        console.log("Success Helmet")
    }
)

//NOTE: Draco Loaderであれば、GLTFバージョンも問題なく動作させることができるよ
// Draco バージョンをLoadする方法
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("/draco/")
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load(
    "/models/Duck/glTF-Draco/Duck.gltf",
    (gltf) =>
    {
        // scene.add(gltf.scene)
    }
)

//NOTE: Animations
let mixer = null
gltfLoader.load(
    "/models/Fox/glTF/Fox.gltf",
    (gltf) =>
    {
        // Animation Clipがあるか確認
        console.log(gltf.animations)

        // AnimationMixer for Handling Animation
        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[0])
        console.log(action)
        //NOTE: Update させなければ Play 実行しても レンダリング上は更新されないので注意!
        action.play()


        gltf.scene.scale.set(0.025, 0.025, 0.025)
        scene.add(gltf.scene)
    }
)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update mixer
    if (mixer !== null)
    {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()