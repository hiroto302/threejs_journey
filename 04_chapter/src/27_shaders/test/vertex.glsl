/* Vertex Shader（頂点シェーダー）について

役割: 3Dモデルの各頂点（vertex）を処理する
主な処理:
  頂点の座標変換（ワールド座標 → スクリーン座標）
  頂点の位置、色、テクスチャ座標などの属性を次の段階に渡す

実行回数: メッシュの頂点数分だけ実行される
  例: 立方体なら8回、球体なら頂点数分実行
*/

// 各 uniform (変換行列) について
/* NOTE: 投影変換行列
  全頂点で共通の値
  CPUからGPUに渡される定数
  Three.jsが自動的にこれらの値をシェーダーに渡している
    const material = new THREE.RawShaderMaterial({
        vertexShader: testVertexShader,
        // Three.jsが内部的に以下のようなuniformを設定
        uniforms: {
            projectionMatrix: { value: camera.projectionMatrix },
            viewMatrix: { value: camera.matrixWorldInverse },
            modelMatrix: { value: mesh.matrixWorld }
    }
})
*/

/* NOTE: 座標変換の流れ
  mat4 : 4 * 4 の行列型
  1. modelMatrix: オブジェクトのローカル座標 → ワールド座標
  2. viewMatrix: ワールド座標 → カメラから見た座標
  3. projectionMatrix: 3D座標 → 2Dスクリーン座標
*/

/* NOTE: projectionMatrix
  transform the coordinates into the clip space coordinates
*/
uniform mat4 projectionMatrix;

/* NOTE: viewMatrix (ビュー変換行列)
  apply transformations relative to the camera (position, rotation, field of view, near, far)
  カメラの位置・向き
*/
uniform mat4 viewMatrix;


/* NOTE:  modelMatrix (モデル変換行列)
  apply transformations relative to the Mesh (position, rotation, scale)
  オブジェクトの位置・回転・スケール
*/
uniform mat4 modelMatrix;

/*NOTE: Attribute ジオメトリから渡される頂点属性
  各頂点固有の値
  ジオメトリから来るデータ（座標、UV、法線など）
  attribute の値はジオメトリが生成した頂点データから決定する
  ex) const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
      内部的に以下のような頂点座標配列が生成される
      positions = [
        -0.5, -0.5, 0.0,  // 頂点1 (x, y, z)
         -0.5, -0.484, 0.0, // 頂点2
        ...
        0.5, 0.5, 0.0     // 頂点1024 (32×32+1 = 1089個の頂点)
        ]

    上記の値をThree.jsが自動的にgeometryの属性をshaderに渡す
    geometry.attributes.position → attribute vec3 position
*/
attribute vec3 position;

/* NOTE: GLSL (OpenGL Shading Language) について
  CPU ではなく GPUで動作するので、console などを実行して、ログを表示することはできない
  ;(セミコロン) がC#などと同様に必要である。 JavaScript は必要ないからこんがらがるけど注意だよ
  typed language である！(型付言語)
*/

/* NOTE: main() について
  - Called automatically
*/
void main()
{
  // 座標変換: ローカル座標 → ワールド座標 → ビュー座標 → スクリーン座標
  // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

  // ジオメトリのローカル座標を、ワールド座標のどこに配置することを決定
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  // NOTE: 波を表現
  // 各頂点のzを変更する、各頂点のX座標（-0.5 ～ +0.5）
  modelPosition.z += sin(modelPosition.x * 10.0) * 0.1;

  // viewMatrix (camera.matrixWorldInverseの値) に掛け合わせて、viewPosition(カメラから見た3D座標)を取得
  vec4 viewPosition = viewMatrix * modelPosition;
  // projectionMatrix(camera.projectionMatrix)と掛け合わせること、最終的に2Dスクリーン座標を取得
  vec4 projectedPosition = projectionMatrix * viewPosition;

  // NOTE gl_Position : GLSL の組み込み変数（built-in variable) について
  // Vertex Shader の最終出力。「この頂点をスクリーンのどの位置に描画するか」をGPUに教える
  gl_Position = projectedPosition;
}
