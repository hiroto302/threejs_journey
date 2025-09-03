uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;

/* NOTE 頂点シェーダー
  役割: 頂点の位置を変換し、最終的なクリップ空間での位置を計算する
  - modelMatrix: モデルのローカル座標をワールド座標に変換するための行列
  - viewMatrix: ワールド座標をカメラ（ビュー）座標に変換するための行列
  - projectionMatrix: カメラ座標をクリップ空間に変換するための行列
  - position: 頂点のローカル座標（モデル空間での位置）

  変数:
  ワールド座標 (modelPosition)：3D空間での絶対的な位置、頂点のワールド座標
  ビュー座標 (viewPosition)：カメラを原点とした相対的な位置
  クリップ座標 (projectedPosition)：最終的にスクリーンに投影される位置

  座標変換の流れ:
  ローカル座標 → ワールド座標 → ビュー座標 → クリップ座標 → 画面座標
    ↓              ↓              ↓              ↓
  position    modelPosition  viewPosition  projectedPosition
*/

void main()
{
  // ワールド座標 = modelMatrix * ローカル座標
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  //Elevation
  // ワールド座標の x,z位置を基に波の高さを計算
  float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                    sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
                    uBigWavesElevation;
  // y座標（高さ）に波の変位を加算
  modelPosition.y += elevation;

  //Point: ワールド座標をカメラから見た座標系（ビュー座標系）に変換
  vec4 viewPosition = viewMatrix * modelPosition;
  //Point: ビュー座標を最終的に2D画面に表示するための座標系（クリップ座標系）に変換
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}