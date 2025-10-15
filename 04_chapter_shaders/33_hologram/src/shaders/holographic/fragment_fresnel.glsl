uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;

void main()
{
  // Normal
  vec3 normal = normalize(vNormal);

  // Stripes
  float stripes = mod((vPosition.y - uTime * 0.02) * 20.0, 1.0);
  stripes = pow(stripes, 3.0);

  // Fresnel effect
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  // +1.0 は 正面の頂点との計算では、-1.0 になるため、0.0 から始まるように調整。
    // 90度の所が0.0 が1.0 になる。
    // 180度(真裏)の所が1.0 が2.0 になってしまうのは問題ない。
  // float fresnel = dot(viewDirection, vNormal) + 1.0;
  float fresnel = dot(viewDirection, normal) + 1.0;

  // Pow で調整
  fresnel = pow(fresnel, 2.0);

  // Holographic (Combine Fresnel and stripes)
  float holographic = fresnel * stripes;
  holographic += fresnel * 1.25;


  // Final color with Fresnel effect
  // gl_FragColor = vec4(0.0, 1.0, 1.0, stripes);
  // gl_FragColor = vec4(vNormal, 1.0);
  gl_FragColor = vec4(1.0, 1.0, 1.0, holographic);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}