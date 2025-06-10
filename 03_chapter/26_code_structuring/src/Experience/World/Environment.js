import * as THREE from 'three'
import Experience from "../Experience";

export default class Environment
{
  constructor()
  {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug

    // Debug
    if (this.debug.active)
    {
      this.debugFolder = this.debug.ui.addFolder('environment')
    }

    this.setSunLight()
    this.setEnvironmentMap()
  }

  setSunLight()
  {
    this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
    this.sunLight.castShadow = true
    this.sunLight.shadow.camera.far = 15
    this.sunLight.shadow.mapSize.set(1024, 1024)
    this.sunLight.shadow.normalBias = 0.05
    this.sunLight.position.set(3.5, 2, - 1.25)
    this.scene.add(this.sunLight)

    //NOTE: Debug
    if (this.debug.active)
      {
        this.debugFolder
            .add(this.sunLight, 'intensity')
            .name('sunLightIntensity')
            .min(0)
            .max(10)
            .step(0.001)

        this.debugFolder
            .add(this.sunLight.position, 'x')
            .name('sunLightPosX')
            .min(-5)
            .max(5)
            .step(0.001)

        this.debugFolder
            .add(this.sunLight.position, 'y')
            .name('sunLightPosY')
            .min(-5)
            .max(5)
            .step(0.001)

        this.debugFolder
            .add(this.sunLight.position, 'z')
            .name('sunLightPosZ')
            .min(-5)
            .max(5)
            .step(0.001)
      }
  }

  setEnvironmentMap()
  {
    this.environmentMap = {}
    this.environmentMap.intensity = 0.4
    //NOTE: ロードが完了している CubeTexture を 環境マップに適用
    this.environmentMap.texture = this.resources.items.environmentMapTexture
    this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace

    // NOTE: scene.environment：シーン全体の照明として機能
    this.scene.environment = this.environmentMap.texture

    //NOTE: 関数をメソッドのプロパティとして定義
    this.environmentMap.updateMaterials = () =>
    {
      //NOTE: traverseは再帰的にシーン内の全オブジェクト（子、孫、ひ孫...）を巡回します
      // なので以下の処理は、Scene 内に追加されているオブジェク全てに対して実行される
      this.scene.traverse((child) =>
      {
        //NOTE: material.envMap：オブジェクト表面の反射として機能
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
          child.material.envMap = this.environmentMap.texture             // 環境マップテクスチャを設定
          child.material.envMapIntensity = this.environmentMap.intensity  // 強度設定
          /*NOTE: WebGLはシェーダープログラムを使用してGPUで描画していて、
              マテリアルのプロパティが変更されたことをThree.jsに通知して、シェーダーを再コンパイルして！」と伝える必要がある
          */
          child.material.needsUpdate = true                               // 再描画フラグ

        }
      })
    }
    this.environmentMap.updateMaterials()

    //NOTE: Debug
    if (this.debug.active)
    {
      this.debugFolder
          .add(this.environmentMap, 'intensity')
          .name('envMapIntensity')
          .min(0)
          .max(4)
          .step(0.001)
          .onChange(this.environmentMap.updateMaterials)
    }
  }
}