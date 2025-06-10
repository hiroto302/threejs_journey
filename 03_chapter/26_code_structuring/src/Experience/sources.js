/*NOTE: string型 name・type プロパティと、
        配列string型 path のプロパティを持っているオブジェクトの配列型
*/
export default [
  {
    //NOTE: キューブテクスチャ（環境マップ）は立方体の6面に対応する6枚の画像が必要
    // そのため、path を 配列型にする必要がある
    name: 'environmentMapTexture',
    type: 'cubeTexture',
    path:
    [
      'textures/environmentMap/px.jpg', // 右
      'textures/environmentMap/nx.jpg', // 左
      'textures/environmentMap/py.jpg', // 上
      'textures/environmentMap/ny.jpg', // 下
      'textures/environmentMap/pz.jpg', // 前
      'textures/environmentMap/nz.jpg'  // 後
    ]
  },
  // dirt texture (地面を表現するテクチャ)
  {
    name: 'grassColorTexture',
    type: 'texture',
    path: 'textures/dirt/color.jpg'
  },
  {
    name: 'grassNormalTexture',
    type: 'texture',
    path: 'textures/dirt/normal.jpg'
  },
  // Fox Model
  {
    name: 'foxModel',
    type: 'gltfModel',
    path: 'models/Fox/glTF/Fox.gltf'
  }
]