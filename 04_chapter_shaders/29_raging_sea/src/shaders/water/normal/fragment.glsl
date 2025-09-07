uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

void main()
{
  // 一面に色をつける
  // vec3 color = mix(uDepthColor, uSurfaceColor, vElevation);
  // gl_FragColor = vec4(color, 1.0);

  /*NOTEO: vec4(vElevation, vElevation, vElevation, 1.0) によるグレースケール表現
  rgb の各要素が同じ値なので、グレースケールのカラーになる。
  vElevation の値は -1.0 から +1.0 である。
  OpenGLでは、色の値は 0.0 ~ 1.0 の範囲 で扱われる.
  そのため、負の値の場合は 0.0 として扱われる。
  波の高い部分（山）: vElevation > 0 → 明るい色（白っぽい）
  波の低い部分（谷）: vElevation < 0 → 暗い色（黒っぽい）
  平面部分: vElevation ≈ 0 → 中間色（グレー）

  これにより、波の高さに応じて明暗が変化するグレースケールの水面が表現される。

  負の値の場合は 0.0 として扱うため、谷の部分は完全に黒くなる表現ではなく、色を適用させたければ、
  offset や mix 関数(leap関数)を使用して表現してやろう！

  */
  // step0: グレースケール 表現 で変化をわかりやすく確認
  // gl_FragColor = vec4(vElevation, vElevation, vElevation, 1.0);



  /*NOTE: 波の高さに応じて色を変化させる表現
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier について
    - uColorOffset: 色の変化の基準点を調整するオフセット値
    - uColorMultiplier: 色の変化の強さを調整する倍率
    - mixStrength: 波の高さに基づいて色を混ぜる強さを計算
      - vElevation + uColorOffset: 波の高さにオフセットを加えることで、色の変化の基準点を調整
      - これにより、波の高さが低い部分でも色が変化し始めるようになる
      - 例えば、uColorOffset を正の値に設定すると、波の高さが低い部分でも色が変化し始める
      - 逆に負の値に設定すると、波の高さが高い部分でのみ色が変化し始める
      - さらに、uColorMultiplier を掛けることで、色の変化の強さを調整できる
        - 今回の場合は、値が低いほど、uDepthColor に近い色になる
        - 値が高いほど、uSurfaceColor に近い色になる
      - 大きな値にすると、わずかな波の高さの違いでも色が大きく変化するようになる
      - 小さな値にすると、波の高さの違いによる色の変化が緩やかになる

    - mix( uDepthColor, uSurfaceColor, mixStrength ): 深い色と浅い色を mixStrength に基づいて混ぜる
      - mixStrength が 0 に近い場合は uDepthColor に近い色になる
      - mixStrength が 1 に近い場合は uSurfaceColor に近い色になる

    mix関数の定義
      mix(a, b, t) = a × (1.0 - t) + b × t
        a: uDepthColor (深い色)
        b: uSurfaceColor (浅い色)
        t: mixStrength (混合比率 0.0~1.0)



    この手法により、波の高さに応じて水面の色が自然に変化する表現が可能になる。
  */

  // step1: グレースケール 表現 で変化をわかりやすく確認
  // float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  // vec3 color = vec3(mixStrength, mixStrength, mixStrength);
  // gl_FragColor = vec4(color, 1.0);

  /* step2: 具体値で変化を確認する
  mix(a, b, t) = a × (1.0 - t) + b × t に対して、
  a = vec3(0.1, 0.1 , 0.1) b= (1.0, 1.0 , 1.0) の時のグレースケールカラーが代入され、t = 0.5 を想定で確認。
  a と b の値に vec3 が代入されるというのは、rgb各要素ごとに計算されるということ。
  rの場合:
    r = 0.1 * (1.0 - 0.5) + 1.0 * 0.5
      = 0.05 + 0.5
      = 0.55
  上記のような計算が r, g, b それぞれに対して行われる。
  その結果として、(0.55, 0.55, 0.55) のグレースケールカラーが得られる。
  */
  // float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  // vec3 color = mix( vec3(0.1, 0.1 , 0.1), vec3(1.0, 1.0, 1.0), mixStrength );
  // gl_FragColor = vec4( color, 1.0 );

  // step3: 実際の色で変化を確認する
  float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  vec3 color = mix( uDepthColor, uSurfaceColor, mixStrength );
  gl_FragColor = vec4( color, 1.0 );

  #include <colorspace_fragment>
}