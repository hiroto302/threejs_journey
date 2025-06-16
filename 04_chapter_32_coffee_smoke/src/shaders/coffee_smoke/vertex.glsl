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
  //  perintexture の 真ん中したから上にかけての不規則なr値を取得
  float twistPerlin = texture(
      uPerlinTexture,
      vec2(0.5, uv.y * 0.2 - uTime * 0.005)
      ).r;
  float angle = twistPerlin * 10.0;
  newPosition.xz = rotate2D(newPosition.xz, angle);


  // Wind (bottom は動かず、top にかけて動くようなやつ)
  // TODO: これ風の方向に従って動くようなものを作れるな! チャレンジしたいな！ 以下のTODOや各値を変数化すれば制御できる
  vec2 windOffSet = vec2(
    //NOTE: 参照する画像が白黒なので、r・g・b の値はどれも共通して 0 or 1 を返す。 なので -0.5 すれば、-0.5 ~ 0.5の値を取得可能
    //NOTE: 0.25 や 0.75 と別の位置を参照する perlinTextureをノイズパターンが異なる値を取得したいため
    texture(uPerlinTexture, vec2(0.25, uTime * 0.01)).r - 0.5,
    texture(uPerlinTexture, vec2(0.75, uTime * 0.01)).r - 0.5
  );
  // TODO: 10.0 を -10.0 にすれば逆方向に流れる
  // TODO: 4.0 の値を変更すれば どこから曲線を曲げるようにするか制御できる
  windOffSet *= pow(uv.y, 4.0) * 10.0;

  // 風の影響を煙に与える！
  newPosition.xz += windOffSet;


  // Final position
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

  // Varying
  vUv = uv;
}