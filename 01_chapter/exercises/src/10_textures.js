import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/* TODO: Texture について
カラーテクスチャ（Diffuse/Albedo）: オブジェクトの基本的な色や模様
アルファテクスチャ: 透明度を制御
ハイトテクスチャ: 表面の凹凸を表現（ディスプレイスメントマップ）
ノーマルテクスチャ: 光の反射方向を調整して凹凸感を生み出す
アンビエントオクルージョン: 間接光の遮蔽を表現
メタルネス: 金属感の度合い
ラフネス: 表面の粗さ

テクスチャには様々なプロパティがあり、これらを調整することで見た目をカスタマイズが可能となる
*/
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => {
    console.log("loadingManager: loading started")
}
loadingManager.onLoad = () => {
    console.log("loadingManager: loading finished")
}
loadingManager.onProgress = () => {
    console.log("loadingManager: loading progressing")
}
loadingManager.onError = () => {
    console.log("loadingManger: loading error")
}

const textureLoader = new THREE.TextureLoader(loadingManager)

// const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png')
// const colorTexture = textureLoader.load('/textures/checkerboard-2x2.png

//NOTE: 各Loader毎にもコールバックを実装可能
const colorTexture = textureLoader.load(
    '/textures/minecraft.png',
    () => {
        console.log('textureLoader: loading finished')
    },
    () => {
        console.log('textureLoader: loading progressing')
    },
    () => {
        console.log('textureLoader: loading error')
    }
)

colorTexture.colorSpace = THREE.SRGBColorSpace      // 色空間
colorTexture.wrapS = THREE.MirroredRepeatWrapping   // 水平方向ラッピング: 繰り返し(ミラー)
colorTexture.wrapT = THREE.MirroredRepeatWrapping   // 垂直方向ラッピング: 繰り返し(ミラー)
// THREE.RepeatWrapping, THREE.ClampToEdgeWrapping など他にも色々とあるよ)

// オフセット(位置調整)
// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5
// colorTexture.rotation = Math.PI * 0.25
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5


/* NOTE: Texture の各プロパティについて
Mipmaps や Filter を活用して、オブジェクトが遠近によってTextureをどのように表示するかを設定する
各プロパティをどのように設定すればいいか適宜考える

以下、講義より抜粋
The minification filter happens when the pixels of texture are smaller than the pixels of the render. In other words, the texture is too big for the surface, it covers.
You can change the minification filter of the texture using the minFilter property.
There are 6 possible values:

THREE.NearestFilter
THREE.LinearFilter
THREE.NearestMipmapNearestFilter
THREE.NearestMipmapLinearFilter
THREE.LinearMipmapNearestFilter
THREE.LinearMipmapLinearFilter
The default is THREE.LinearMipmapLinearFilter. If you are not satisfied with how your texture looks, you should try the other filters.

We won't see each one, but we will test the THREE.NearestFilter, which has a very different result:




*/
// ミップマップを無効化 にしてパフォーマンス向上する場合がある
colorTexture.generateMipmaps = false
// 縮小フィルター（テクスチャがオブジェクトより小さく表示される場合）
colorTexture.minFilter = THREE.NearestFilter
// 拡大フィルター（テクスチャがオブジェクトより大きく表示される場合）
colorTexture.magFilter = THREE.NearestFilter





const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')


/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
console.log(geometry.attributes)

/*NOTE: 作成したTextureをGeometryに適用させる

MeshBasicMaterial: 最も単純で、ライトの影響を受けない。パフォーマンスは良いが、立体感に欠ける
MeshLambertMaterial: 基本的な拡散反射のみ（ハイライトなし）
MeshPhongMaterial: 拡散反射と鏡面反射（光沢）あり
MeshStandardMaterial: PBRマテリアル。メタルネスとラフネスで物理的に正確な表現が可能
MeshPhysicalMaterial: StandardMaterialの拡張版。透明度やクリアコートなど追加機能あり


const material = new THREE.MeshStandardMaterial({
    map: colorTexture,                           // 色テクスチャ
    normalMap: normalTexture,                    // 法線マップ
    metalnessMap: metalnessTexture,              // 金属度マップ
    roughnessMap: roughnessTexture,              // 粗さマップ
    aoMap: ambientOcclusionTexture,              // アンビエントオクルージョンマップ
    displacementMap: heightTexture,              // 変位マップ
    alphaMap: alphaTexture,                      // 透明度マップ

    metalness: 0.5,                              // ベースの金属度（0〜1）
    roughness: 0.5,                              // ベースの粗さ（0〜1）
    displacementScale: 0.1,                      // 変位の強さ
    aoMapIntensity: 1                            // AOの強さ
});



*/
const material = new THREE.MeshBasicMaterial({ map: colorTexture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
camera.position.z = 1
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


// 右クリックメニューを有効にする
// canvas.addEventListener('contextmenu', (event) => {
//     // デフォルトではOrbitControlsがevent.preventDefault()を呼び出すため
//     // ここでストップする必要がある
//     event.stopPropagation();
//     // 以下はコメントアウトして右クリックメニューが表示されるようにする
//     // event.preventDefault();
// },true);