uniform sampler2D uPerlinTexture;
varying vec2 vUv;

void main()
{
  // Smoke
  // smoke texture の r チャンネルの値のみ使用
  float smoke = texture(uPerlinTexture, vUv).r;


  // Final Color
  gl_FragColor = vec4(1.0, 1.0, 1.0, smoke);


  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}