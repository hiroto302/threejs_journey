uniform float uTime;
uniform sampler2D uPerlinTexture;

varying vec2 vUv;

vec2 rotate2D(vec2 value, float angle)
{
  float s = sin(angle);
  float c = cos(angle);
  mat2 m = mat2(c, s, -s, c);
  return m * value;
}

void main()
{
  // Twist : y軸を中心にして捻ったものを渡す

  // 1. これはこれでシンプルで綺麗
  // vec3 newPosition = position;
  // float angle = newPosition.y;                       //  エレベーションさせる
  // newPosition.xz = rotate2D(newPosition.xz, angle);  //  回転

  // 2. 不規則な回転
  vec3 newPosition = position;
  float twistPerlin = texture(uPerlinTexture, vec2(0.5, uv.y * 0.2)).r;   //  perintexture の 真ん中したから上にかけての不規則なr値を取得
  float angle = twistPerlin * 10.0;                                       //  エレベーションさせる
  newPosition.xz = rotate2D(newPosition.xz, angle);                       //  回転


  // Final position
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

  // Varying
  vUv = uv;
}