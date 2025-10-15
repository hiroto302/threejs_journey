/* Note:
  * varying について
    - varying は 頂点シェーダーからフラグメントシェーダーにデータを渡すために使用される
    - varying = 頂点とピクセルを繋ぐ橋渡し役
    - vertex.glsl で normal にセットした値は、頂点を参照した値。
      それを、varying で、ピクセルに対して補間された値を渡してくれいている。

  * normalize(vNormal) なぜ fragment shader で正規化するのか
    - 1つ目の理由
      頂点シェーダーで計算された値は、フラグメントシェーダーに渡される際に補間される
      例えば、3つの頂点があり、それぞれの頂点で異なる法線ベクトルがある場合
      フラグメントシェーダーに渡される法線ベクトルは、これらの頂点の法線ベクトルの補間値になる
      そのため、フラグメントシェーダーで受け取った法線ベクトルは、必ずしも長さ1の単位ベクトルとは限らない
      だから、フラグメントシェーダーで normalize() を使って法線ベクトルを正規化する必要がある

    - 2つ目の理由
      vertex.glsl で modelMatrix を使ってワールド空間に変換したnormal(法線ベクトル)を受け取っている。
      modelMatrix にスケール変換が含まれていると、normalの長さが1でなくなる可能性がある。
      だから、normalize() を使って長さ1の単位ベクトルに正規化している。

  * viewDirection
    - カメラ位置(cameraPosition)から頂点の位置(vPosition)へのベクトルを計算
    - これも正規化して長さ1の単位ベクトルにしている

  * dot(viewDirection, normal)
    dot(a, b) = cos(θ)
    - 2つのベクトルの内積を計算
    - θ = 2つのベクトル間の角度
    - 結果は **-1.0 から 1.0** の範囲

    見る角度θ (角度)dot の値意味
    - dot の値が 1.0 の場合、法線ベクトルはカメラ方向と完全に一致している（0度）
    - dot の値が 0.0 の場合、法線ベクトルはカメラ方向に対して直交している（90度）
    - dot の値が -1.0 の場合、法線ベクトルはカメラ方向と反対を向いている（180度）

    dot(viewDirection, normal) は「カメラから見てどれくらい斜めか」を数値化している。
      - 正面から見る → -1.0 に近い値
      - 横から見る → 0.0 に近い値
      - 真裏から見る → 1.0 に近い値

  * Fresnel 効果の考え方
    - Fresnel 効果は、視線と表面の法線ベクトルの角度に基づいて、反射の強さが変化する現象
    - Fresnel 効果をシミュレートするために、dot(viewDirection, normal) の結果を使用
    - 実装したいイメージ
        正面から見る → 暗い(透明)
        斜め・横から見る → 明るい(光る)
        輪郭を強調したい

    - dot の結果に +1.0 を加えて、範囲を 0.0 から 2.0 にシフト
      正面は 0.0 から始まり、
      横が   1.0、
      真裏が 2.0 になる

  * gl_FrontFacing
    - フラグメントが表面に属しているか裏面に属しているかを判定する組み込み変数
    - true なら表面、false なら裏面

  * normal *= -1.0;
    - Fresnel 効果の計算で、裏面の場合は法線ベクトルを反転させることで、正しい効果を得ることができる
      - 真裏は 1.0 値。(normal と viewDirection が同じ方向を向いている)
      - normalを反転させることで 0.0 を取得可能(normal と viewDirection が逆方向を向いている)

  * Falloff
    滑らかな減衰を作成するために使用
    - float falloff = smoothstep(0.8, 0.0, fresnel);
    - holographic *= falloff;
      fresnel が 0.0 から 0.8 の範囲で、滑らかに 1.0 → 0.0 へフェードアウトさせる
      0.0〜0.8 の範囲で徐々に減衰
      0.8 以降は完全に 0.0 (消える)
*/

uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;

void main()
{
  // Normal
  vec3 normal = normalize(vNormal);

  // ④裏面の場合、法線を反転
  if (!gl_FrontFacing) {
    normal *= -1.0;
  }

  // ① Stripes
  float stripes = mod((vPosition.y - uTime * 0.02) * 20.0, 1.0);
  stripes = pow(stripes, 3.0);


  // ② Fresnel effect
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  // +1.0 は 正面の頂点との計算では、-1.0 になるため、0.0 から始まるように調整。
    // 90度の所が0.0 が1.0 になる。
    // 180度(真裏)の所が1.0 が 2.0 になってしまうので gl_FrontFacing を使って inverting する
  // float fresnel = dot(viewDirection, vNormal) + 1.0;
  float fresnel = dot(viewDirection, normal) + 1.0;
  // Pow で値を調整
  fresnel = pow(fresnel, 2.0);


  // ⑤ Falloff
  float falloff = smoothstep(0.8, 0.0, fresnel);

  // ③ Holographic (Combine Fresnel and stripes)
  float holographic = fresnel * stripes;
  // 少し明るくしたいので 1.25 倍
  holographic += fresnel * 1.25;
  holographic *= falloff;



  // Final color with Fresnel effect
  // gl_FragColor = vec4(0.0, 1.0, 1.0, stripes);
  // gl_FragColor = vec4(vNormal, 1.0);
  gl_FragColor = vec4(1.0, 1.0, 1.0, holographic);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}