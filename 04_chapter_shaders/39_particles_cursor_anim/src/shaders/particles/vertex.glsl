/* パーティクルにどのような力を与えるか定義
    * smoothstep(0.1, 0.3, displacementIntensity)
        0.1 以下の値を 0 に、0.3 以上の値を 1 に変換
        0.1 から 0.3 の間の値を 0 から 1 の間に線形補間

        0.3の値を1にすることで、パーティクルがより早く最大変位に達するように調整。
        動きがよりダイナミックで視覚的に興味深くなる。値を変更して遊んでみよう。

    * Displacement direction
        cos(aAngle), sin(aAngle) を使って、ランダムな方向にパーティクルを動かす。
        これにより、パーティクルが均一に広がり、自然な動きが生まれる。
        円周上の方向を作ります。これでパーティクルは中心から放射状に散らばります。
*/

uniform vec2 uResolution;
uniform sampler2D uPictureTexture;
uniform sampler2D uDisplacementTexture;

attribute float aIntensity;
attribute float aAngle;

varying vec3 vColor;

void main()
{
    // Displacement
    vec3 newPosition = position;
    float displacementIntensity = texture(uDisplacementTexture, uv).r;
    displacementIntensity = smoothstep(0.1, 0.3, displacementIntensity);

    // Calculate displacement direction (パーティクルが動く方向を決定)
    vec3 displacement = vec3(
        cos(aAngle) * 0.2,      // x軸方向の変位
        sin(aAngle) * 0.2,      // y軸方向の変位
        1.0                     // z軸方向の変位
    );
    // Normalize and scale displacement
    displacement = normalize(displacement);
    // Apply intensity of movement mouse
    displacement *= displacementIntensity;
    // 移動距離の倍率を1.0から3.0に変更して、より大きく動くように調整
    displacement *= 3.0;
    // Apply randomness intensity
    displacement *= aIntensity;
    // Update new position
    newPosition += displacement;

    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Picture
    float pictureIntensity = texture(uPictureTexture, uv).r;
    // float pictureIntensity = texture(uDisplacementTexture, uv).r; ← test displacement texture

    // Point size
    gl_PointSize = 0.15 * pictureIntensity * uResolution.y;     // Adjust point size 0.15 to 0.15 based on plane geometry resolution
    gl_PointSize *= (1.0 / - viewPosition.z);                   // 前面に来るほど大きくする

    // Varyings
    vColor = vec3(pow(pictureIntensity, 2.0));                  // 中間色を暗く引き締め、コントラストを高くする
}