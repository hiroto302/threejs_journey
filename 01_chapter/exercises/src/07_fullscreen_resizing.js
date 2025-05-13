import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// スクリーンサイズが変更された時のイベント処理でリサイズする！各要素を更新して画面上に反映させる!
window.addEventListener("resize", () => {
    console.log("window has been resized!")
    // update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    // update camera
    camera.aspect = sizes.width / sizes.height
    //NOTE: これを実行しなければ、オブジェクトのサイズがリサイズされずに伸縮してしまう。カメラの種類やアスペクト比を変更した時
    camera.updateProjectionMatrix()
    // update renderer
    renderer.setSize(sizes.width, sizes.height)
    //NOTE: 設定しない場合（デフォルト=1)、高解像度ディスプレイでは、エッジがジャギーで表示される可能性がある。随時調整する。
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// フルスクリーン (ここでは、ダブルクリックした時)
window.addEventListener("dblclick", () =>
{
    if (!document.fullscreenElement)
    {
        canvas.requestFullscreen()
        console.log("go fullscreen")
    }
    else
    {
        console.log("leave fullscreen")
        document.exitFullscreen()
    }
}
)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enabled = true
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()