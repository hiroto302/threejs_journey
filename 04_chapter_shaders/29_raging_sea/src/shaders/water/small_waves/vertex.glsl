uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallWavesIterations;

varying float vElevation;

// 参照: https://claude.ai/share/689a7751-7fc6-4e78-971c-dfd53769e3e9

//	Classic Perlin 3D Noise
//	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
// このc関数はClassic Perlin 3D Noiseの実装で、Stefan Gustavson氏の有名なwebgl-noiseライブラリ
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

// -1.0 ~ 1.0の範囲でノイズを生成
// vec3 P: 3次元座標（x, y, z）この座標に基づいて、滑らかで自然なランダム値を生成
float cnoise(vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                    sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
                    uBigWavesElevation;

  /* small waves を追加
  1. modelPosition.xz * uSmallWavesFrequency * i
      XZ平面（水平面）の座標を周波数でスケール
      i倍することで、ループごとに周波数が高くなる（細かい波）

  2. uTime * uSmallWavesSpeed
      Z軸成分として時間を使用
      波のアニメーション（時間変化）を表現

  3. abs(cnoise(...))
      ノイズの絶対値を取る。-1.0〜1.0の範囲を0.0〜1.0に変換
      常に正の値になるため、波が「下に凹む」ことがない

  4. * uSmallWavesElevation / i
      ノイズの振幅をuSmallWavesElevationでスケールし、iで割ることで
      ループごとに振幅が小さくなる（細かい波の影響が小さくなる）
      uSmallWavesElevation：小さい波の最大高さ
      /i：高周波成分ほど振幅を小さくする（自然な見た目）

  5. elevation -= ...
      各ループで計算された小波の高さをメインのelevationから減算
      これにより、小波が全体の波の形状に影響を与え
      減算している点が重要
      abs()で正の値になったノイズを引くことで、波の谷や細かい凹凸を作成

  6. forループ
      uSmallWavesIterations回ループして、小波の影響を累積
      これにより、より複雑で自然な波の表現が可能

    小波 と言っているが、これはは波の谷や細かい凹凸を作成しているイメージである。
    Noise を利用すると、滑らかで自然なランダム値を生成できるため、波の形状にリアリズムを追加できる
  */

  // step1: なだらかな波の変化(sin波)に対して、ノイズを追加して小波を表現
  // elevation += cnoise(vec3(modelPosition.xz * uSmallWavesFrequency, 0));

  // step2: 引数3つ目に時間を入れて、波をアニメーション (elevation 作成時のアニメーションとは別に小波を動かすイメージ)
  // elevation += cnoise(vec3(modelPosition.xz * uSmallWavesFrequency, uTime * uSmallWavesSpeed));

  // step3: conoiseの結果に対して、高さを調整
  // elevation += cnoise(vec3(modelPosition.xz * uSmallWavesFrequency, uTime * uSmallWavesSpeed)) * uSmallWavesElevation;

  // step4: abs()で負の値を正に変換して、波が下に凹みを反転。その値を引くことで、波の谷や細かい凹を作成。結果的に、波の形状に近づく
  // 前回までは、実際は 山の部分が連続するイメージだったが、谷の部分も作成されるイメージ
  // elevation -= abs(cnoise(vec3(modelPosition.xz * uSmallWavesFrequency, uTime * uSmallWavesSpeed)) * uSmallWavesElevation);

  // step5: 小波の影響をループで累積(step4の小波の中に小波を作成するイメージ)。1~3回ループの中で、それぞれ異なるcnoiseの値が生成されている。
  // for (float i = 1.0; i <= 3.0; i++)
  // {
  //   elevation -= abs(cnoise(vec3(modelPosition.xz * uSmallWavesFrequency, uTime * uSmallWavesSpeed)) * uSmallWavesElevation);
  // }

  // step6: 累積するだけど奇妙な動きになってしまうので、iを利用して、周波数(uSmallWavesFrequency)と振幅(uSmallWavesElevation)を調整
  // ポイントは、周波数にiをかけることで、ループごとに周波数が高くなり（細かい波）、振幅をiで割ることで、ループごとに振幅が小さくなる（細かい波の影響が小さくなる）
  // for (float i = 1.0; i <= 3.0; i++)
  // {
  //   elevation -= abs(cnoise(vec3(modelPosition.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
  // }

  // step final : 美しい波の表現の完成！
  for (float i = 1.0; i <= uSmallWavesIterations; i++)
  {
    elevation -= (abs(cnoise(vec3(modelPosition.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) ) * uSmallWavesElevation / i);
  }

  modelPosition.y += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  vElevation = elevation;
}