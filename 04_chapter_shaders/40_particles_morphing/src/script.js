/* NOTE: 実装メモ
    *THREE.Points
        オブジェクトを粒子(パーティクル)の集合として表示するためのクラス
        ジオメトリの各頂点を個別の点として描画する

        Mesh の場合:
            頂点 → 三角形 → 面(ソリッド)
        Points の場合:
            頂点 → 個別の点(四角いスプライト) → 各点が独立したスプライト

    * material settings
        * blending: THREE.AdditiveBlending
            加算合成モード。パーティクルが重なると明るくなる効果を生む
        * depthWrite: false
            透明な時、後ろのパーティクルが描画されるようにする
        * transparent: true
            透明度を有効にする

    * particle.geometry.setIndex(null)
        インデックスバッファを無効にすることで、ジオメトリの各頂点が個別に描画されるようにする
        Points ではインデックスバッファは不要

    * 今回使用するmodels.glbについて
        4つの異なる形状(モデル)が含まれている

        gltf.scene.children.map(child => console.log(child.geometry.attributes.position))
            これにより、各形状の頂点情報を確認できる

    * Float32Array を Three.js のジオメトリで使えるBufferAttribute形式に変換
        new THREE.Float32BufferAttribute(newArray, 3)
*/

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import GUI from 'lil-gui'
import gsap from 'gsap'
console.log('ok')
import particlesVertexShader from './shaders/particles/vertex.glsl'
import particlesFragmentShader from './shaders/particles/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Materials
    if(particles !== null)
    {
        particles.material.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)
    }

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 8 * 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

debugObject.clearColor = '#160920'
gui.addColor(debugObject, 'clearColor').onChange(() => { renderer.setClearColor(debugObject.clearColor) })
renderer.setClearColor(debugObject.clearColor)

/**
 * Particles
 */
// Load models
let particles = null
gltfLoader.load('./models.glb', (gltf) =>
{
    // Object < scene < children に4つのメッシュが含まれていることを確認
    // console.log(gltf)

    particles = {}
    particles.index = 0

    gltf.scene.children.map(child => console.log(child.geometry.attributes.position))

    // Positions
    const positions = gltf.scene.children.map(child => child.geometry.attributes.position)
    console.log(positions)
    // ここで各形状の頂点数を確認して、最大頂点数を取得する
    particles.maxCount = 0
    for(const position of positions)
    {
        if(position.count > particles.maxCount)
        {
            particles.maxCount = position.count
        }
    }
    // console.log(particles.maxCount)

    particles.positions = []
    for (const position of positions)
    {
        const originalArray = position.array
        const newArray = new Float32Array(particles.maxCount * 3)

        for (let i = 0; i < particles.maxCount; i++)
        {
            const i3 = i * 3

            if(i3 < originalArray.length)
            {
                newArray[i3 + 0] = originalArray[i3 + 0]
                newArray[i3 + 1] = originalArray[i3 + 1]
                newArray[i3 + 2] = originalArray[i3 + 2]
            }
            else
            {
                // 足りない分はランダムに既存の頂点をコピーして補完
                const randomIndex = Math.floor(position.count * Math.random()) * 3
                newArray[i3 + 0] = originalArray[randomIndex + 0]
                newArray[i3 + 1] = originalArray[randomIndex + 1]
                newArray[i3 + 2] = originalArray[randomIndex + 2]
            }
        }

        particles.positions.push(new THREE.Float32BufferAttribute(newArray, 3))
    }

    console.log(particles.positions)

    // Geometry
    const sizeArray = new Float32Array(particles.maxCount)
    for(let i = 0; i < particles.maxCount; i++)
    {
        sizeArray[i] = Math.random()
    }

    // particles.geometry = new THREE.SphereGeometry(3)
    particles.geometry = new THREE.BufferGeometry()
    particles.geometry.setAttribute('position', particles.positions[particles.index])
    particles.geometry.setAttribute('aPositionTarget', particles.positions[3])
    particles.geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizeArray, 1))
    particles.geometry.setIndex(null)

    // Material
    particles.colorA = '#8a188c'
    particles.colorB = '#0091ff'
    particles.material = new THREE.ShaderMaterial({
        vertexShader: particlesVertexShader,
        fragmentShader: particlesFragmentShader,
        uniforms:
        {
            uSize: new THREE.Uniform(0.4),
            uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
            uProgress: new THREE.Uniform(0.0),
            uColorA: new THREE.Uniform(new THREE.Color(particles.colorA)),
            uColorB: new THREE.Uniform(new THREE.Color(particles.colorB)),
        },
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
    })

    // Points
    particles.points = new THREE.Points(particles.geometry, particles.material)
    particles.points.frustumCulled = false
    scene.add(particles.points)

    // bounding & frustrum culling fix
    // window.requestAnimationFrame(() =>
    // {
    //     console.log(particles.points.geometry.boundingSphere)
    // })

    // Methods ← gui 上から4つのボタンを追加して形状を切り替えられるようにする
    particles.morphTo = (index) =>
    {
        // Update attributes
        particles.geometry.attributes.position = particles.positions[particles.index]
        particles.geometry.attributes.aPositionTarget = particles.positions[index]

        // Animation uProgress
        gsap.fromTo(
            particles.material.uniforms.uProgress,
            { value: 0 },
            { value: 1, duration: 3.0, ease: 'linear' }
        )

        // Save index
        particles.index = index
    }
    particles.morph0 = () => { particles.morphTo(0) }
    particles.morph1 = () => { particles.morphTo(1) }
    particles.morph2 = () => { particles.morphTo(2) }
    particles.morph3 = () => { particles.morphTo(3) }


    // Tweaks
    gui.addColor(particles, 'colorA').onChange(() =>
    {
        particles.material.uniforms.uColorA.value.set(particles.colorA)
    })
    gui.addColor(particles, 'colorB').onChange(() =>
    {
        particles.material.uniforms.uColorB.value.set(particles.colorB)
    })

    // listen uProgress
    gui.add(particles.material.uniforms.uProgress, 'value', 0, 1, 0.01).name('uProgress').listen()

    gui.add(particles, 'morph0').name('Morph to 0')
    gui.add(particles, 'morph1').name('Morph to 1')
    gui.add(particles, 'morph2').name('Morph to 2')
    gui.add(particles, 'morph3').name('Morph to 3')
})

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render normal scene
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()