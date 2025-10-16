/* Note:
  * This is a vertex shader for rendering holographic effects in a 3D scene using Three.js.
  - modelMatrix, viewMatrix, projectionMatrix are provided by Three.js
  - position and normal are provided by Three.js
  - gl_Position is a built-in variable that sets the final position of the vertex
  - varying variables are used to pass data from the vertex shader to the fragment shader

  * Normal について
    - normal は 頂点の法線ベクトル
    - 頂点シェーダーの中の normal は、Three.js が自動的に提供してくれる attribute(属性値)
    - 法線ベクトルは、頂点がどの方向を向いているかを示すベクトル
      (その頂点がある面に対して垂直(perpendicular)な方向を示すベクトル
      「この頂点はどの方向を向いているか」を表す情報)
    - 法線ベクトルは、通常は単位ベクトル（長さが1のベクトル）として扱われる
    - これを使って、光の当たり方や反射の計算を行うことができる → 今回は Fresnel 効果の計算に使用

  * attribute について
    - attribute は 頂点シェーダーの中の attribute(属性値)
    - 頂点シェーダーに渡される各頂点ごとのデータ
    - 例えば、位置(position)、法線(normal)、色(color)、テクスチャ座標(uv)などがある
    - attribute は 頂点ごとに異なる値を持つ
    - attribute は 頂点シェーダー内でのみ使用可能で、フラグメントシェーダーには直接渡せない
    - attribute のデータは、頂点シェーダー内で varying を使ってフラグメントシェーダーに渡すことができる

  * attribute normal について
    Three.js のジオメトリ(例: SphereGeometry)を作成すると、自動的に各頂点に normal が計算されて格納される
    この normal は ローカル空間(オブジェクト空間)で定義されています
    → つまり、オブジェクトが回転・移動する前の座標系での向き

  * modelMatrix について
    - modelMatrix は モデル変換行列
    - オブジェクトのローカル空間(オブジェクト空間)からワールド空間への変換を行う行列
    - これを使って、オブジェクトの位置、回転、スケールをワールド空間に変換する
    - 例えば、オブジェクトがシーン内で移動したり回転したりする場合、その変換を modelMatrix に反映させる
    - modelMatrix は 4x4 の行列で表され、頂点の位置や法線を変換するために使用される

  * modelNormal について
    - Fresnel 効果の考えで、常に、ジオメトリの外側をフレネル反射させたい。
      オブジェクトが回転する時、法線ベクトルをワールド空間に変換する必要がある。
    - カメラから見た方向を計算するために、頂点の位置も modelMatrix を使ってワールド空間に変換する。

  * 法線ベクトルの変換について
    - 法線ベクトルは、位置ベクトルとは異なる方法で変換する必要がある
    vec4(position, 1.0)  // ← 位置(点)
    vec4(normal, 0.0)    // ← 方向(ベクトル)

    w = 1.0 (位置)
      平行移動の影響を受ける ✓
      「どこにあるか」を表す
    w = 0.0 (方向)
      平行移動の影響を受けない ✓
      「どの向きか」を表す

      なぜ法線は 0.0 なのか
    法線ベクトルは方向だけが重要で、位置は関係ない
    例:
      オブジェクトを右に3メートル移動しても、法線の向きは変わらない
      でもオブジェクトを回転させたら、法線の向きは変わる
    だから modelMatrix をかける時に 0.0 にすることで、回転とスケールだけ適用され、平行移動は無視される。
*/

uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;

#include ../includes/random2D.glsl

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Glitch effect
  float glitchTime = uTime - modelPosition.y;
  // float glitchStrength = sin(glitchTime);       // ← 単純な sin 波を使った glitch アニメーション (-1.0 〜 1.0 の値を返す)  
  float glitchStrength = sin(glitchTime)
                        + sin(glitchTime * 3.45)
                        + sin(glitchTime * 8.76);  // 複数の sin 波を組み合わせて、より複雑な glitch アニメーションに (-3.0 〜 3.0 の値を返す)
  glitchStrength /= 3.0;                                  // -1.0 〜 1.0 の値を返す
  glitchStrength *= smoothstep(0.3, 1.0, glitchStrength); // 0.3 までは glitch しない (-1.0 〜 0.3 の値を 0.0 にする)
  glitchStrength *= 0.25;                                 // glitch の強さを調整 (0.0 〜 0.25 の値を返す)
  modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;  // X 軸に Glitch させる
  modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrength;  // Z 軸に Glitch させる

  // Final position
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  // Model normal
  vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

  // Varying
  vPosition = modelPosition.xyz;
  // vNormal = normal;
  vNormal = modelNormal.xyz;
}