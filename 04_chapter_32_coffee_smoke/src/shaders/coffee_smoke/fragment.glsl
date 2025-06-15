uniform float uTime;
uniform sampler2D uPerlinTexture;
varying vec2 vUv;

void main()
{
  // Scale & Animate
  vec2 smokeUv = vUv;
  smokeUv.x *= 0.5;
  smokeUv.y *= 0.3;
  smokeUv.y -= uTime * 0.03;  // マイナスにすることで、煙が下から上へ上がるように見える


  // Smoke
  // smoke texture の r チャンネルの値のみ使用
  float smoke = texture(uPerlinTexture, smokeUv).r;


  // Final Color
  gl_FragColor = vec4(1.0, 1.0, 1.0, smoke);


  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}