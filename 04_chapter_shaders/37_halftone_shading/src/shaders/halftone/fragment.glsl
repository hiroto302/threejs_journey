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
    uv = mod(uv * repetitions, 1.0);

    // Radius & Intensity
    float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);

    // Point distance from center
    float point = distance(uv, vec2(0.5));
    point = 1.0 - step(0.5 * intensity, point);

    // Apply halftone
    // color = mix(color, pointColor, point);

    // Final color
    // gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(uv, 1.0, 1.0);
    // gl_FragColor = vec4(point, point, point, 1.0);
    // gl_FragColor = vec4(intensity, intensity, intensity, 1.0);


    // use func halftone
    color = halftone(
        color,
        uShadowRepetitions,
        vec3(0.0, -1.0, 0.0),
        normal,
        - 0.8,
        1.5,
        uShadowColor
    );

    color += halftone(
        color,
        uLightRepetitions,
        vec3(1.0, 1.0, 0.0),
        normal,
        0.5,
        1.5,
        uLightColor
    );

    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}