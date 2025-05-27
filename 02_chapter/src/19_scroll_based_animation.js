import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() =>
    {
        material.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
/*NOTE: 適用する画像が、陰影の段階を決定。その時、どのように反映させるか。
LinearFilter（デフォルト）の場合：滑らかなグラデーション・リアルな陰影
NearestFilter の場合：段階的な色の変化・アニメ風のハッキリした陰影
*/
gradientTexture.magFilter = THREE.NearestFilter

// Material
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture       // ← マップの設定
})

// Objects
const objectsDistance = 4
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

mesh1.position.x = 2
mesh2.position.x = - 2
mesh3.position.x = 2

// 1~3番目のセクションに対応した Y の配置
mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [ mesh1, mesh2, mesh3 ]

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/**
 * Particles
 */
// Geometry
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    /* NOTE: パーティクルYの位置決定する計算について
    objectsDistance * 0.5 = 4 * 0.5 = 2 これが開始位置
    Math.random() * 4 * 3 = 2 ~ -10 の範囲
    */
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

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
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
/* NOTE:
    視野角35度、距離6の位置からの見え方。この設定で「objectsDistance = 4」が適切な間隔になる。
    視野角70度にしたら全体が見えるような形になるので面白い！
*/
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
// window.scrollY : 現在のドキュメントが垂直方向にスクロールされているピクセル数を返す
let scrollY = window.scrollY
// 現在一番近いセクション
let currentSection = 0

window.addEventListener('scroll', () =>
{
    // 最新の位置の更新
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)

    if(newSection != currentSection)
    {
        currentSection = newSection
        //NOTE: 指定されたtargetのプロパティを、varsオブジェクトで定義された値までアニメーションさせる
        gsap.to(
            // target
            sectionMeshes[currentSection].rotation,
            {
                // アニメーションの各種設定
                duration: 1.5,          // 完了するまでの時間
                ease: 'power2.inOut',   // イージングの指定
                x: '+=6',               // 現在の回転値に指定された値を追加
                y: '+=3',
                z: '+=1.5'
            }
        )
    }
})

/**
 * Cursor
 * tickのアニメーション関数内でカーソル制御を実装
 */
const cursor = {}
//NOTE: 0を初期値に代入し、マウスがまだ動かされていない状態でも、カメラが初期位置から突然動くことを防ぐ
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    // マウスカーソルのX座標を0（左端）から1（右端）までの範囲に正規化して取得
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

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

    // Animate camera
    /* NOTE: クロールに応じてカメラを移動量を算出
    scrollY: スクロール量（ピクセル）
    sizes.height: ウィンドウの高さ（ピクセル）= 100vh
    objectsDistance: Three.js世界での間隔 = 4

    Three.js Unit ≠ 固定のピクセル数
    Three.jsの1UnitがWebページでどのくらいの距離に見えるかは、「カメラの位置と視野角」「レンダラーのサイズ」「スクロール同期の計算式」によって決まる。
    今回場合、objectsDistance = 4 が「100vhスクロールする間隔」として設計されている
    */
    camera.position.y = - scrollY / sizes.height * objectsDistance

    /* NOTE: カーソルによるカメラ制御
    0.5を掛けることで、パララックス効果の強度を調整
    結果的にparallaxXは-0.25から0.25の範囲になります。この値が、カメラが最終的に目指すべきX位置の目標値。
    係数0.5は、マウスを端まで動かしてもカメラが大きく動きすぎないように、パララックスの度合いを制御。
    */
    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    /* 補間（Lerp: Linear Interpolation）の概念に基づいた滑らかな動きを実装する一般的なテクニック
        (parallaxX - cameraGroup.position.x): 現在のカメラのX位置と目標のX位置(parallaxX)との間の差を計算
        * 5: 5は追従速度または補間係数です。この値が大きいほど、カメラは目標位置に素早く追従します。小さいほど、ゆっくりと滑らかに追従
        deltaTime: 前回からのフレームからの経過時間。

        全体として、この行は、cameraGroupのX位置を目標parallaxXに徐々に近づけていくように更新
        これにより、マウスを動かしたときにカメラがカクカク動くのではなく、スムーズに追従するようにする
    */
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()