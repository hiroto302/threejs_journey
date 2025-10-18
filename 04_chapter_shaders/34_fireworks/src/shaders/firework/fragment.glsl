uniform sampler2D uTexture;

void main()
{
  vec4 textureColor = texture2D(uTexture, gl_PointCoord);
  float textureAlpha = textureColor.r;

  // Final color
  // gl_FragColor = vec4(gl_PointCoord, 1.0, 1.0);
  // gl_FragColor = vec4(textureColor.rgb, 1.0);
  gl_FragColor = vec4(textureColor.rgb, textureAlpha);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}