uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec2 uFrequency;
uniform float uTime;

attribute vec3 position;
// 27_shaders.js で追加した attribute を使用する
attribute float aRandom;
// Texture を展開するために必要なもの
attribute vec2 uv;

//NOTE varying : vertex shader から flagment shader へデータを受け渡すためのもの
varying float vRandom;
varying vec2 vUv;


void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  // Title: 「平面を凹凸化」
  // modelPosition.z += aRandom * 0.1;

// Title: 「Waves」
  modelPosition.z += sin(modelPosition.x * uFrequency.x + uTime) * 0.1;
  modelPosition.z += sin(modelPosition.y * uFrequency.y + uTime) * 0.1;


  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  // フラグメントシェーダーに渡す値の決定
  vRandom = aRandom;

  vUv = uv;
}