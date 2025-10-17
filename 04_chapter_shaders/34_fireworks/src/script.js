import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import fireworkVertexShader from './shaders/firework/vertex.glsl'
import fireworkFragmentShader from './shaders/firework/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()

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
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1.5, 0, 6)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Fireworks
 */
const createFirework = (count, position, size) =>
{
    const positionsArray = new Float32Array(count * 3)
    for (let i = 0; i < count; i++)
    {
        const i3 = i * 3
        positionsArray[i3 + 0] = (Math.random() - 0.5) * 1.0 // x
        positionsArray[i3 + 1] = (Math.random() - 0.5) * 1.0 // y
        positionsArray[i3 + 2] = (Math.random() - 0.5) * 1.0 // z

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionsArray, 3))

        // Material
        const material = new THREE.ShaderMaterial({
            vertexShader: fireworkVertexShader,
            fragmentShader: fireworkFragmentShader,
            uniforms:
            {
                //TODO: adjust size based on your needs.
                //NOTE: 画面の大きさに応じて調整する処理実装したい
                uSize: new THREE.Uniform(size)
            }
            // size: 0.1,
            // sizeAttenuation: true,
            // color: new THREE.Color(`hsl(${Math.random() * 360}, 100%, 50%)`),
            // transparent: true,
            // alphaMap: textureLoader.load('/textures/particles/1.png'),
            // depthWrite: false,
            // blending: THREE.AdditiveBlending
        })

        // Points
        const firework = new THREE.Points(geometry, material)
        firework.position.copy(position)
        scene.add(firework)
    }
}

createFirework(
    100,                    // count
    new THREE.Vector3(),    // position
    20.0                    // size
)

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()