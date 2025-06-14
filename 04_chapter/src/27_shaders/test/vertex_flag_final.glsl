//NOTE: 以下のように SadderMaterial の場合は、 以下でコメントアウトしている uniform・attribute が元から定義されている
// uniform mat4 modelMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 projectionMatrix;
uniform vec2 uFrequency;
uniform float uTime;

// 27_shaders.js で追加した attribute を使用する
// attribute vec3 position;
attribute float aRandom;
// attribute vec2 uv;

//NOTE varying : vertex shader から flagment shader へデータを受け渡すためのもの
varying float vRandom;
varying vec2 vUv;

varying float vElevation;


// Title: 「Flag に影を！」
void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevation = sin(modelPosition.x * uFrequency.x + uTime) * 0.1;
  elevation += sin(modelPosition.y * uFrequency.y + uTime) * 0.1;
  modelPosition.z += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vRandom = aRandom;

  vUv = uv;
  vElevation = elevation;
}