uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;

varying float vElevation;

void main()
{
  // 一面に色をつける
  // gl_FragColor = vec4(color, 1.0);

  /*NOTEO: 各頂点に対する値が変わるで、グラデーションになる
  波の高い部分（山）: vElevation > 0 → 明るい色（白っぽい）
  波の低い部分（谷）: vElevation < 0 → 暗い色（黒っぽい）
  平面部分: vElevation ≈ 0 → 中間色（グレー）
  */
  gl_FragColor = vec4(vElevation, vElevation, vElevation, 1.0);

  // vec3 color = mix( uDepthColor, uSurfaceColor, vElevation * 5.0 + 0.5 );

  #include <colorspace_fragment>
}