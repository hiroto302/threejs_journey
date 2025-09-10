uniform float uTime;
uniform float uSize;

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;


void main()
{
  //Position
  // vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  // vec4 viewPosition = viewMatrix * modelPosition;
  // vec4 projectionPosition = projectionMatrix * viewPosition;
  // gl_Position = projectionPosition;

  //Sin
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float angle = atan(modelPosition.x, modelPosition.z);
  float distanceToCenter = length(modelPosition.xz);
  float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
  angle += angleOffset;
  modelPosition.x = cos(angle) * distanceToCenter;
  modelPosition.z = sin(angle) * distanceToCenter;

  // Randomness
  // modelPosition.x += aRandomness.x;
  // modelPosition.y += aRandomness.y;
  // modelPosition.z += aRandomness.z;
  modelPosition.xyz += aRandomness;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;
  gl_Position = projectionPosition;

  //Size
  gl_PointSize = uSize * aScale;
  // Scale the size based on distance
  gl_PointSize *= (1.0 / - viewPosition.z);


  //Color
  vColor = color;
}