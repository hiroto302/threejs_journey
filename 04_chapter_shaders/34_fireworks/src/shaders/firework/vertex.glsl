//NOTE: 5 phases of firework animation
// 1. The particles start to expand fast in every direction
// 2. They scale up even faster
// 3. They start to fall down slowly
// 4. They scale down
// 5. They twinkle as they disappear

uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;

attribute float aSize;
attribute float aTimeMultiplier;

float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax)
{
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

void main()
{
  float progress = uProgress * aTimeMultiplier;
  vec3 newPosition = position;

  // Exploding
  float explodingProgress = remap(progress, 0.0, 0.1, 0.0, 1.0);
  explodingProgress = clamp(explodingProgress, 0.0, 1.0);
  //NOTE: これは、外側から内側に向かって動くの、これはこれで面白い表現になる
  // explodingProgress = 1.0 - pow(explodingProgress, 3.0);
  explodingProgress = 1.0 - pow(1.0 - explodingProgress, 3.0);

  // Falling
  float fallingProgress = remap(progress, 0.1, 1.0, 0.0, 1.0);
  fallingProgress = clamp(fallingProgress, 0.0, 1.0);
  fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0);
  newPosition.y -= fallingProgress * 0.2;

  // Scaling
  float sizeOpeningProgress = remap(progress, 0.0, 0.125, 0.0, 1.0);
  float sizeClosingProgress = remap(progress, 0.125, 1.0, 1.0, 0.0);
  float sizeProgress = min(sizeOpeningProgress, sizeClosingProgress);
  sizeProgress = clamp(sizeProgress, 0.0, 1.0);

  // Twinkling
  float twinkleProgress = remap(progress, 0.2, 0.8, 0.0, 1.0);
  twinkleProgress = clamp(twinkleProgress, 0.0, 1.0);
  float sizeTwinkling = sin(progress * 30.0) * 0.5 + 0.5;
  sizeTwinkling = 1.0 - sizeTwinkling * twinkleProgress;


  newPosition *= explodingProgress;

  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;

  // Final position
  gl_Position = projectionMatrix * viewPosition;

  // Final size
  gl_PointSize = uSize * uResolution.y * aSize * sizeProgress * sizeTwinkling;
  gl_PointSize *= 2.0 / - viewPosition.z;
}