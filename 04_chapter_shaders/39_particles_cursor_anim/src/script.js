import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import particlesVertexShader from './shaders/particles/vertex.glsl'
import particlesFragmentShader from './shaders/particles/fragment.glsl'

/**
 * Base
 */
// Canvas
// CSSセレクタで、クラス名がwebglのcanvas要素を探す。.htmlの<canvas class="webgl"></canvas>を取得
// ここでは、既存のHTML内のcanvas要素を取得して使う
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
    particlesMaterial.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

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
camera.position.set(0, 0, 18)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,     //  ← ここで渡されたcanvas要素でWebGLを使う
    antialias: true
})
renderer.setClearColor('#181818')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

/**
 * Displacement
 */
// Object to hold all displacement related data with object literal (empty object)
const displacement = {}

// 2D canvas
/* Global Objects
    document : The global object representing the HTML document
    other global objects: window, navigator, location, history, screen
*/

/* DOM(Document Object Model)
    HTML文書をJavaScriptで操作できるようにする仕組み
    HTML → DOM → JavaScript の変換
*/
// ここでは、新たにcanvas要素を作成している
displacement.canvas = document.createElement('canvas')
// Set size of the canvas for drawing resolution (pixel size)
displacement.canvas.width = 128
displacement.canvas.height = 128
displacement.canvas.style.position = 'fixed'
// Set size of the canvas for display
displacement.canvas.style.width = '128px'
displacement.canvas.style.height = '128px'
displacement.canvas.style.top = '0'
displacement.canvas.style.left = '0'
displacement.canvas.style.zIndex = '10'
displacement.canvas.style.border = '2px solid white'
// Display the canvas on the webpage to add it to the DOM
document.body.append(displacement.canvas)

/* Context : API for drawing on the canvas
    * Canvasの描画方法
        Canvas2D: 2Dグラフィックス用。Shaderは使えない
        → canvas.getContext('2d')

        WebGL: 3Dグラフィックス用。Shaderが使える
        → canvas.getContext('webgl')
*/
// Get 2D drawing context from the canvas
displacement.context = displacement.canvas.getContext('2d')
displacement.context.fillStyle = 'black'    // ← Set background style before fillRect
displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height)

// Glow image
/* Image
    HTML要素の<img>タグに対応するオブジェクト
    画像をJavaScriptで操作できるようにする仕組み

    <!-- HTMLで書く場合 -->
    <img src="./glow.png" alt="glow">

    今回は、JavaScriptで画像を読み込んでいる。
    DOMに追加指定なので、画面には表示されない。
    しかし、canvasの描画に使える。
    tick 関数内で、displacement.context.drawImage()で描画している。
*/
displacement.glowImage = new Image()
displacement.glowImage.src = './glow.png'

// Interactive plane
// Plane to use for raycasting to get 3D coordinates of mouse cursor
// マウスカーソルの3D座標を取得するための「当たり判定用の平面メッシュ」
// マウスカーソルからrayを飛ばして、この平面メッシュと交差した点のUV座標を使う
displacement.interactivePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),   // ← Size should match particles plane size
    new THREE.MeshBasicMaterial({ color: 'red', side: THREE.DoubleSide })
)
displacement.interactivePlane.visible = false
scene.add(displacement.interactivePlane)

// Raycaster
displacement.raycaster = new THREE.Raycaster()

// Coordinates
/* 3つの座標の役割
    スクリーン座標 (screen coordinates)
        画面上の2D座標。XとYは-1から1の範囲。Zは使わない。
        マウスイベントのclientX/clientYを変換して求める。
        Raycasterで使用。

    キャンバス座標 (canvas coordinates)
        displacement.canvas上の2D座標。ピクセル単位。
        raycasterで取得したUV座標を変換して求める。
        描画位置を指定するために使用。

    ワールド座標 (world coordinates)
        3D空間上の座標。X、Y、Zすべて使う。
        今回は使わないが、raycasterで取得できる。
        速度計算

    * 初期値が9999な理由
    - 画面外の座標（存在しない位置）
    - ページ読み込み直後、マウスが動くまで無効にする
    - Raycasterが画面外を指すので、交差しない
*/
// Initialize coordinates far away to avoid initial intersection
displacement.screenCursor = new THREE.Vector2(9999, 9999)
displacement.canvasCursor = new THREE.Vector2(9999, 9999)
displacement.canvasCursorPrevious = new THREE.Vector2(9999, 9999)

window.addEventListener('pointermove', (event) =>
{
    /* Update screen coordinates
        Convert mouse position to normalized device coordinates (NDC) ranging from -1 to 1
        ブラウザ座標（ピクセル）→ 正規化デバイス座標（-1 ~ 1）

        ブラウザ座標              正規化デバイス座標
        (0, 0)────→ X          (-1, 1)────→ X
        │                       │
        │                       │
        ↓ Y                     ↓ Y
                            (1, -1)

        左上が原点               中央が原点
        Y軸下向き                Y軸上向き

        理由: ブラウザとWebGLでY軸の向きが逆だから
            ブラウザ: 上→下が正（↓）
            WebGL:   下→上が正（↑）
    */
    displacement.screenCursor.x = (event.clientX / sizes.width) * 2 - 1
    displacement.screenCursor.y = - (event.clientY / sizes.height) * 2 + 1

    // console.log(displacement.screenCursor.x)
    // console.log(displacement.screenCursor.y)
})

// Texture
/* Canvas Texture
    Canvas要素を3Dオブジェクトに貼り付けるためのテクスチャに変換
    2D canvasの内容をテクスチャとして使う仕組み
    2D canvasの内容が変わったら、texture.needsUpdate = true を実行して更新する必要がある
*/
displacement.texture = new THREE.CanvasTexture(displacement.canvas)

/**
 * Particles
 */
const particlesGeometry = new THREE.PlaneGeometry(10, 10, 128, 128)
/* Shader で使わない属性を削除して軽量化
    * setIndex(null)
        PlaneGeometry は三角形のポリゴン（面）として描画するために「どの点とどの点を繋ぐか」という情報（インデックス）を持っています。
        しかし、今回は「点（Points）」としてバラバラに描画するので、「繋ぎ方」の情報は不要です。削除してメモリを節約します。

    * deleteAttribute('normal')
        PlaneGeometry は光の当たり方の計算で利用する「法線ベクトル（normal）」という情報を持っています。
        しかし、今回は normal を活用した計算をしないので、この情報は不要です。削除してメモリを節約します。
*/
particlesGeometry.setIndex(null)
particlesGeometry.deleteAttribute('normal')

// Vertex shader で使用する変数の強度を、各頂点ごとにランダムに求める。Attributeは頂点ごとのデータを格納するための仕組みだったよね。
// 1. 頂点の数だけ配列を作成
const intensitiesArray = new Float32Array(particlesGeometry.attributes.position.count)
const anglesArray = new Float32Array(particlesGeometry.attributes.position.count)
// 2. 配列にランダムな値をセット
for(let i = 0; i < particlesGeometry.attributes.position.count; i++)
{
    intensitiesArray[i] = Math.random()
    anglesArray[i] = Math.random() * Math.PI * 2
}
// 3. BufferAttributeとしてジオメトリに追加
// BufferAttribute(..., 1) の 1 は、「1つの頂点につきデータ1個（float）」という意味
particlesGeometry.setAttribute('aIntensity', new THREE.BufferAttribute(intensitiesArray, 1))
particlesGeometry.setAttribute('aAngle', new THREE.BufferAttribute(anglesArray, 1))

const particlesMaterial = new THREE.ShaderMaterial({
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    uniforms:
    {
        uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
        uPictureTexture: new THREE.Uniform(textureLoader.load('./picture-1.png')),
        // マウスの軌跡が描かれた黒いキャンバスをテクスチャとして渡しています。Shader はこの画像を読み込んで、「白い部分＝マウスがいる場所」と判断
        uDisplacementTexture: new THREE.Uniform(displacement.texture)
    },
    // AdditiveBlending (加算): 重なれば重なるほど明るくなる。パーティクル表現に適している。
    blending: THREE.AdditiveBlending
})
/* Mesh と Points の違い
    Mesh: 面として描画。ジオメトリの頂点を三角形で繋いでポリゴンを形成する。
    Points: 点として描画。ジオメトリの頂点をバラバラに表示する。
        Points を使うと、Vertex Shader で gl_PointSize という特別な変数を使って、点ごとのサイズを制御可能
        パーティクルの表現に適している
*/
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    /**
     * Raycaster
     */
    // カーソルからrayを飛ばす
    displacement.raycaster.setFromCamera(displacement.screenCursor, camera)
    // そのrayと、interactivePlaneメッシュの交差を調べる
    const intersections = displacement.raycaster.intersectObject(displacement.interactivePlane)

    // 交差している場合
    if(intersections.length)
    {
        // 交差点のUV座標を取得
        // UV座標: 左下が(0,0)、右上が(1,1)
        const uv = intersections[0].uv
        // console.log(uv)

        // UV座標をキャンバス座標に変換
        // Canvas座標系 : 左上が(0,0)、右下が(幅,高さ) ピクセル単位 (今回の場合は、0〜128)
        displacement.canvasCursor.x = uv.x * displacement.canvas.width
        displacement.canvasCursor.y = (1 - uv.y) * displacement.canvas.height
        // console.log(displacement.canvasCursor.x)
        // console.log(displacement.canvasCursor.y)
    }

    /**
     * Displacement
     * Drawing on the 2D canvas to create displacement texture
     * キャンバスに描画して、変位テクスチャを作成
     * 「マウスの軌跡(Trails)を、時間とともにフェードアウトする光の残像として記録する」を目的としている
     * * 実際には、Fadeout は透明度を下げた黒色でキャンバス全体を塗りつぶすことで実現している
     *  → 2Dキャンバスに描画し、その内容をテクスチャとして使う
     */
    // 1. Fade out previous frame (既存の GlowImage を黒色で徐々に覆う)
    /*
        * GlobalCompositeOperation (描画の合成方法) source-over
            合成方法を'source-over'に設定（デフォルト値）
            新しく描くもの（source）を、既存の内容（destination）の上に重ねる
        * GlobalAlpha (透明度) 0.02
            これから描画するものの透明度
            透明度を0.02に設定（非常に薄い黒）
            これを全体に上書きすることで、既存の内容(GlowImage)が徐々に黒で覆われ、フェードアウト効果が得られる
    */
    // モード: デフォルト（上書き・混色）
    displacement.context.globalCompositeOperation = 'source-over'
    // 透明度: 2% (非常に薄い)
    displacement.context.globalAlpha = 0.02
    // 画面全体を「現在の描画色（黒）」で塗りつぶす
    displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height)

    // 1.5. Speed alpha
    // * マウスが止まっている時に光り続けるのを防ぐために、透明度をマウスの移動速度に応じて変化させる
    // 2点間の距離を計算 (前回のCursor位置と現在のCursor位置から求める)
    const cursorDistance = displacement.canvasCursorPrevious.distanceTo(displacement.canvasCursor)
    // 現在位置を前回位置として保存。次のフレームの計算で使用
    displacement.canvasCursorPrevious.copy(displacement.canvasCursor)
    // 透明度を計算 (距離に応じて0〜1の範囲。 移動距離に応じて透明度を決定)
        // 速く動く → 明るい光
        // ゆっくり動く → 暗い光
        // ただし最大1（100%）を超えない
    const alpha = Math.min(cursorDistance * 0.05, 1)

    // 2. Draw glow (最後にglow画像を描画)
    const glowSize = displacement.canvas.width * 0.25
    /*
        * GlobalCompositeOperation (描画の合成方法) lighten
            - 既存の色と新しい色を比較して、明るい方を採用
            「今ある色と、新しい画像の色を比べて、明るい方を採用する」 という処理
    */
    // モード: 加算（明るい部分だけ残す）
    displacement.context.globalCompositeOperation = 'lighten'
    // displacement.context.globalCompositeOperation = 'source-over' // ← 他のmodeを試し見て mode の違いを確認
    // さっき計算した「速さ」を透明度にセット
    displacement.context.globalAlpha = alpha
    // 描画
    displacement.context.drawImage(
        displacement.glowImage,                            // Image source
        displacement.canvasCursor.x - glowSize * 0.5,      // X position
        displacement.canvasCursor.y - glowSize * 0.5,      // Y position
        glowSize,                                          // Width
        glowSize                                           // Height
    )

    // Texture
    displacement.texture.needsUpdate = true

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()