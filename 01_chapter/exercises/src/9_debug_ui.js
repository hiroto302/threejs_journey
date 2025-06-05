import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'

/**
 * NOTE: lil-gui Debug
 * パラメーターとして、Object or Property of that object を渡す
 * Setup することが可能 (widthとか)
 * 
 * Three.js プロダクトを見たら、URLの最後尾に 「#Debug」を記載したら DebugUI が表示されるか
 * 
 * 他にも多くの、Debug 手法があるので 「lil-gui.georgealways.com」を確認しよう
 */
const gui = new GUI({
    width: 300,
    title: 'Nice Debug UI',  // デフォルトは Controls
    closeFolders: true       // Rootフォルダである、 Nice Debug UI 以下のフォルダが Close される
})
gui.close() // Rootである自身を閉じる
// gui.hide()  // DebugUIの非表示
//NOTE: Toggling で 非表示を切り替えれるようにする
window.addEventListener('keydown', (event) => {
    if(event.key == 'h'){
        gui.show(gui._hidden);
    }
})




/*NOTE: 色を変更した時、毎回Logを確認しながら反映させるのは面倒。そこで、global・parameters・debugObject と呼ばれるようなものを利用
    Three.js 外部で取得した color Debugした値を直接 参考にできる
*/
const debugObject = {}

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
debugObject.color = "#f97979"

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//NOTE: 多くの DebugUI をオブジェクトに適用すると混在していく。そこで、Folder を 活用しよう！
// ネストして Folderを作成していくことが出来る
const cubeTweaks = gui.addFolder('Awesome cube')
cubeTweaks.close()

//NOTE: Range
cubeTweaks.add(mesh.position, 'x', -3, 3, 0.1)
cubeTweaks.add(mesh.position, 'y').min(-3).max(3).step(0.1)
cubeTweaks.add(mesh.position, 'z').min(-3).max(3).step(0.1).name('奥行き')

// const myObj = {
//     myVariable: 1337
// }
// gui.add(myObj, 'myVariable')

//NOTE: CheckBox
cubeTweaks.add(mesh, 'visible')
cubeTweaks.add(mesh.material, 'wireframe')

/*NOTE: Color
    色に関しては、Three.js と lil-gui 上で表示されるパラメータの色が一致しない
    解決策1 : Retrieving the modified color

*/
// gui.addColor(material, 'color') これだと一致しない
cubeTweaks.addColor(mesh.material, "color").name("mesh color").onChange((value) =>
{
    // console.log("three.js material color : " + material.color)
    console.log(value)
    // HEX String を取得する！
    console.log(value.getHexString())
})

// debugOject を利用して、Three.js 外部の color value を取得すれば上記のように Hex カラーコードは必要ない
cubeTweaks.addColor(debugObject, "color").name("debug color").onChange((value) =>
    {
        // Update DebugObject Color
        material.color.set(value)
    })

// NOTE: Func の Debug UI 実装方法
debugObject.spin = () => {
    gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2})
}
cubeTweaks.add(debugObject, 'spin')

// NOTE: Segments
debugObject.subdivision = 2
cubeTweaks.add(debugObject, 'subdivision').min(1).max(20).step(1).onChange((value) => {
    console.log('subdivision changed')
    // WARNING: The old geometries are still sitting somewhere in the GPU memory which can create a memory leak
    // NOTE: So don't forget to Dispose old there !!
    mesh.geometry.dispose()
    mesh.geometry = new THREE.BoxGeometry(
        1, 1, 1,                // size
        value, value, value     // segments
    )
})


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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
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