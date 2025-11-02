/* NOTE: GLSL の変数について

    * GLSLの「組み込み変数(built-in variable)」組み込み変数の特徴
        - GLSLがあらかじめ用意している変数
        - シェーダー内で直接使用可能
        - 定義不要
        - 入力専用 or 出力専用 or 双方向
        - シェーダーの種類(Vertex Shader / Fragment Shader)によって使用できる変数が異なる

    * 組み込み変数・attribute・uniform・varying の役割
    要素説明
        * 組み込み変数(built-in variable)
            GLSLがあらかじめ用意している変数
            「主要な組み込み変数の種類」
            Vertex Shader
                - gl_Position : 頂点の最終的な位置(出力)
            Fragment Shader
                - gl_FragCoord : 現在のピクセルのスクリーン座標(入力・読み取り専用)
                - gl_FragColor : ピクセルの最終的な色(出力)
        * attribute
            各頂点ごとのデータ
                attribute vec3 position;  // 各頂点の位置
                attribute vec3 normal;    // 各頂点の法線
                attribute vec2 uv;        // 各頂点のUV座標
            読み取り専用のため、一度変数に代入してから使用する
                vec2 vUv = uv;
                vec3 modelPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        * varying
            頂点シェーダーからフラグメントシェーダーにデータを渡すための変数
            頂点シェーダーで計算された値がフラグメントシェーダーで補間される
                varying vec3 vNormal;     // 補間された法線
                varying vec3 vPosition;   // 補間された位置
        * uniform
            シェーダー全体で共通のデータを渡すための変数
            *自動的に提供される(定義不要!)ものもある
                uniform mat4 modelMatrix;       // オブジェクトのローカル→ワールド変換
                uniform mat4 modelViewMatrix;   // オブジェクトのローカル→ビュー変換
                uniform mat4 projectionMatrix;  // ビュー→クリップ空間変換
                uniform mat4 viewMatrix;        // ワールド→ビュー変換
                uniform mat3 normalMatrix;      // 法線変換行列(逆転置行列)
                uniform vec3 cameraPosition;    // カメラのワールド座標位置
            *カスタム uniform は手動で定義
                uColor: new THREE.Uniform(new THREE.Color('#ff794d')),
                uResolution: new THREE.Uniform(new THREE.Vector2(800, 600)),
                uTime: new THREE.Uniform(0),
                uShadowRepetitions: new THREE.Uniform(100.0),
*/

/* NOTE: Halftone Shading
    * ハーフトーンシェーディング とは
        - 印刷物の網点表現を模倣したシェーディング手法
        - 点の大きさや密度を変化させることで、陰影や立体感を表現
        - 主にモノクロや限定された色数で表現されることが多い
        例) スパイダーマンのアニメーションとか見てみて！

    * 実装方法の流れ
        1. ピクセルのスクリーン座標を取得 (gl_FragCoord)
        2. 座標を基にグリッドパターンを生成
        3. 法線と光源方向の内積を計算し、光の強さを決定
        4. 光の強さに応じて点の大きさや密度を調整
        5. 最終的な色を決定し、ピクセルに適用

    * gl_FragCoord について
        - vec4型の変数
        - x, y : ピクセルのスクリーン座標(左下が原点)
        - z : 深度値(0.0〜1.0)
        - w : クリップ空間の同次座標
    例) gl_FragCoord.xy ← スクリーン上のピクセル座標
        例: 画面解像度が 1920x1080 の場合
        x: 0 〜 1920
        y: 0 〜 1080

    * 処理のポイント
    1. 各ピクセルの正規化したスクリーン座標を取得
        gl_FragCoord.xy: スクリーン上のピクセル座標
        uResolution: 画面解像度 (幅, 高さ)

        vec2 uv = gl_FragCoord.xy / uResolution.y;
        例) 画面解像度が 1920x1080 で
                    gl_FragCoord: (960, 540) の中央のピクセルの場合
                    uv = (960/1080, 540/1080) = (0.888..., 0.5)
        つまり
            uv.y は常に 0.0 ~ 1.0 の範囲
            uv.x は画面の横幅に応じて変わる(アスペクト比分だけ伸びる)

        今回の場合は、uv.x は0~1.778 (高さ基準で正規化)
        画面の高さを基準として割ることで、アスペクト比を保持した正方形のグリッドを生成に活用できる

        1ピクセル当たりの uv の変化量:
            横: 1/1080 = 0.00093
            縦: 1/1080 = 0.00093  ← 同じ!

    2. グリッドパターンの生成
        mod と uv を利用してグリッドパターンを生成
            uv = mod(uv * repetitions, 1.0);
        例) 繰り返し回数(repetitions)を 50 とした場合
            uv = mod(uv * repetitions, 1.0);
            uv.x は 0 ~ 1.778 の範囲 → 0 ~ 50 * 1.778 = 88.9 → mod 1.0 → 0 ~ 1.0 の範囲に変換
            uv.y は 0 ~ 1.0 の範囲 → 0 ~ 50 * 1.0 = 50.0 → mod 1.0 → 0 ~ 1.0 の範囲に変換

        結果として、uv は (0~1, 0~1) の範囲にマッピングされ、グリッドパターンが生成される

    3. 法線と光源方向の内積を計算し、光の強さを決定
        光源が下にある時(下から上に向かって光を平行に当てる)
            vec3 direction = vec3(0.0, -1.0, 0.0);
        原点の法線と光源方向の内積を計算
            float intensity = dot(normal, direction);
        光源と反対方向を向いている場合、intensity は負の値になる
        そこで、smoothstep 関数を使って強度を調整、0.0 〜 1.0 の範囲に収める
            intensity = smoothstep(low, high, intensity);

    4. 光の強さに応じて点の大きさや密度を調整
        「各グリッドセルの中心との距離」を計算。Grid cell の中心は (0.5, 0.5)
            float point = distance(uv, vec2(0.5));
        距離が強度に基づいて調整されるようにステップ関数を適用
            point = 1.0 - step(0.5 * intensity, point);
        これにより、強度が高いほど点が大きくなり、強度が低いほど点が小さくなる

        **ロジック:**
        1. `distance(uv, vec2(0.5))` セルの中心からの距離
        2. `0.5 * intensity` - 明るいほど半径が大きくなる
        3. `step()` - しきい値を超えたら1、そうでなければ0
                intensity が高いほど、点が大きくなる
                (つまり、ドットの大き箇所は明るい箇所に対応)
        4. `1.0 - ...` - 反転(ドットの内側が1)

    5. 最終的な色を決定し、ピクセルに適用
        mix 関数を使って、元の色と点の色をブレンド
            return mix(color, pointColor, point);
        point が 1 の場合、点の色が適用され、point が 0 の場合、元の色が適用される

        ここでは、ジオメトリの元の色と点の色を、
        これまでの計算結果であるpoint(光の強さに応じて決定した点のようなもの)割合にブレンドした値を返す

        mix 関数の動作:
            point = 0.0 → color
            point = 1.0 → pointColor
            point が中間値の場合、両方の色が混ざる

        mix() は線形補間(Linear Interpolation, lerp)を行う関数
        mix(a, b, t) は、a と b の間を t の割合で補間した値を返す

*/

uniform vec3 uColor;
uniform vec2 uResolution;
uniform float uShadowRepetitions;
uniform vec3 uShadowColor;
uniform vec3 uLightColor;
uniform float uLightRepetitions;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl
#include ../includes/pointLight.glsl

vec3 halftone(
    vec3 color,
    float repetitions,
    vec3 direction,
    vec3 normal,
    float low,
    float high,
    vec3 pointColor
)
{
    // Grid
    vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv = mod(uv * repetitions, 1.0);

    // Radius & Intensity
    float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);

    // Point distance from center
    float point = distance(uv, vec2(0.5));
    point = 1.0 - step(0.5 * intensity, point);

    // Apply halftone
    return mix(color, pointColor, point);
}

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = uColor;

    // Lights
    vec3 light = vec3(0.0);
    light += ambientLight(
        vec3(1.0),   // Light color
        1.0          // Light intensity
    );
    light += directionalLight(
        vec3(1.0, 1.0, 1.0),
        1.0,
        normal,
        vec3(1.0, 1.0, 0.0),
        viewDirection,
        1.0
    );
    color *= light;


// Halftone
    // Parameters
    float repetitions = 50.0;
    vec3 direction = vec3(0.0, -1.0, 0.0);
    float low = -0.8;
    float high = 1.5;
    vec3 pointColor = vec3(1.0, 0.0, 0.0);

    // Grid
    vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv = mod(uv * 50.0, 1.0);

    // Radius & Intensity
    float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);

    // Point distance from center
    float point = distance(uv, vec2(0.5));
    point = 1.0 - step(0.5 * intensity, point);

    // Apply halftone
    color = mix(color, pointColor, point);

    // Final color
    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(uv, 1.0, 1.0);
    // gl_FragColor = vec4(point, point, point, 1.0);
    // gl_FragColor = vec4(intensity, intensity, intensity, 1.0);


    // use func halftone
    // color = halftone(
    //     color,
    //     uShadowRepetitions,
    //     vec3(0.0, -1.0, 0.0),
    //     normal,
    //     - 0.8,
    //     1.5,
    //     uShadowColor
    // );

    // color += halftone(
    //     color,
    //     uLightRepetitions,
    //     vec3(1.0, 1.0, 0.0),
    //     normal,
    //     0.5,
    //     1.5,
    //     uLightColor
    // );

    // gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}