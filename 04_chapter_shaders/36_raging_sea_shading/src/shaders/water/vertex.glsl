/* NOTE: vertex.glslでneighbours techniqueを使用してnormalを計算する理由

    Attribute Normalの問題
        ジオメトリのattribute normalは、元のジオメトリの静的な法線情報である。
        そのため、頂点がシェーダー内でアニメーションされる場合、attribute normalは正しい法線情報を提供しない。
        PlaneGeometryの場合、全ての頂点のnormalが(0, 1, 0)（上向き）で同じになる。
        fragment shader で gl_FragColor = vec4(vNormal, 1.0); を有効にして確認すると、全て緑色になる。

    Neighbours Techniqueによる解決
        vertex shaderで隣接する頂点を使って動的にnormalを計算する。
        これにより、頂点がアニメーションされても正しい法線情報を得ることができる。

    実装の概要
        1. 現在の頂点位置から少しずらした位置の隣接点を計算する。
        2. それぞれの隣接点の標高を計算する。
        3. 現在の頂点位置と隣接点の位置からベクトルを作成する。
        4. これらのベクトルの外積を計算して法線ベクトルを得る。
        5. 計算した法線ベクトルをvaryingとしてfragment shaderに渡す。

    結果
        この手法により、静的なattribute normalではなく、
        アニメーションする水面の実際の形状に基づいた正確な法線を計算できるため、
        よりリアルな水面の陰影表現が実現できる。

    toBを求める計算する上で、なぜ「-shift」を使うのか
        -shiftを使う理由は右手座標系における法線の向きを正しく計算するためである。

    外積と右手の法則
        外積cross(toA, toB)は右手の法則に従います：
            人差し指：第1ベクトル（toA）の方向
            中指：   第2ベクトル（toB）の方向
            親指：   結果の法線ベクトルの方向

    座標系の確認
        Three.jsでは：
            X軸：右方向（正）
            Y軸：上方向（正）
            Z軸：手前方向（正）
        したがって、Z軸の負方向は奥方向を指します。

    toBの計算
        toB = normalize(modelPositionB - modelPosition.xyz);
        modelPositionBはZ軸負方向にシフトしているため、toBはZ軸負方向を指すベクトルになります。
    これにより、toAがX軸正方向、toBがZ軸負方向を指すことになる。
    右手の法則で実際に指で確認すると、法線ベクトルが上向きになる！
    このベクトルを法線として使用することで、正しい法線方向が得られる！
*/

uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallIterations;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/perlinClassic3D.glsl

float waveElevation(vec3 position)
{
    float elevation = sin(position.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                      sin(position.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
                      uBigWavesElevation;

    for(float i = 1.0; i <= uSmallIterations; i++)
    {
        elevation -= abs(perlinClassic3D(vec3(position.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
    }

    return elevation;
}


void main()
{
    // 現在の頂点から少しずらした位置の隣接点を計算
    // Base position
    float shift = 0.01;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec3 modelPositionA = modelPosition.xyz + vec3(shift, 0.0, 0.0);    // X軸正方向
    vec3 modelPositionB = modelPosition.xyz + vec3(0.0, 0.0, -shift);   // Z軸負方向

    // Elevation
    float elevation = waveElevation(modelPosition.xyz);
    modelPosition.y += elevation;
    // 隣接点の標高も計算
    modelPositionA.y += waveElevation(modelPositionA);
    modelPositionB.y += waveElevation(modelPositionB);

    // Compute normal
    vec3 toA = normalize(modelPositionA - modelPosition.xyz); // X軸正方向のベクトル
    vec3 toB = normalize(modelPositionB - modelPosition.xyz); // Z軸負方向のベクトル
    vec3 computeNormal = cross(toA, toB);                     // 上向きの法線

    // Final position
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Varying
    vElevation = elevation;
    // vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
    vNormal = computeNormal;
    vPosition = modelPosition.xyz;
}