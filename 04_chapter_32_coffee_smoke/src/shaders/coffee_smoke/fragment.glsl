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

  // Remap
  smoke = smoothstep(0.4, 1.0, smoke);

  // Edges (両端をfadeさせる)
  smoke *= smoothstep(0.0, 0.1, vUv.x);
  smoke *= smoothstep(1.0, 0.9, vUv.x);
  smoke *= smoothstep(0.0, 0.1, vUv.y);
  smoke *= smoothstep(1.0, 0.4, vUv.y);


  // Final Color
  gl_FragColor = vec4(vUv, 1.0, smoke);   // r・g・b の値を好きにして楽しもう!
  gl_FragColor = vec4(1.0, 0, 0, 1.0);    // Debug用


  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}