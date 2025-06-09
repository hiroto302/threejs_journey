import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from "./EventEmitter";

export default class Resources extends EventEmitter
{
  constructor(sources)
  {
    super()

    // Options
    this.sources = sources

    // Setup : sources を loading する前の初期化
    this.items = {}                   // item オブジェクト
    this.toLoad = this.sources.length // ロードするアイテムの数
    this.loaded = 0                   // ロード完了したアイテムを表す数の初期値

    this.setLoaders()
    this.startLoading()

  }

  setLoaders()
  {
    //NOTE: {} はオブジェクトを表す。
    this.loaders = {}
    // オブジェクトにプロパティを追加して、各値にインスタンス化したLoaderを代入
    this.loaders.gltfLoader = new GLTFLoader()
    this.loaders.textureLoader = new THREE.TextureLoader()
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
  }

  startLoading()
  {
    // Load each source
    for (const source of this.sources)
    {
      if (source.type == 'gltfModel')
      {
        this.loaders.gltfLoader.load(
          source.path,
          (file) =>
          {
            this.sourceLoaded(source, file)
          }
        )
      }
      else if (source.type == 'texture')
      {
        this.loaders.textureLoader.load(
          source.path,
          (file) =>
          {
            this.sourceLoaded(source, file)
          }
        )
      }
      else if (source.type == 'cubeTexture')
      {
        this.loaders.cubeTextureLoader.load(
          source.path,  // 第一引数 : ロードするファイルパス
          (file) =>     // 第二引数 : 成功時のコールバック関数
          {
            this.sourceLoaded(source, file)
          }
        )
      }
    }
  }

  sourceLoaded(source, file)
  {
    /* NOTE: JavaScript のオブジェクトプロパティ設定記法
        ブラケット記法を使って、オブジェクトにプロパティを動的に設定
        source.name の値に応じて異なるプロパティが作ることが可能となる
        実行後、以下のようになる
        this.items = {
          environmentMapTexture: CubeTextureオブジェクト
        }
    */
    // ロードしたファイルを保存
    this.items[source.name] = file
    // ロード完了カウンターを増加
    this.loaded++
    // 全てのロードが完了したかチェック
    if(this.loaded == this.toLoad)
    {
      console.log('Resources Load Finished')
      //NOTE: このクラスを参照している(World.jsなど)がロード完了の通知を受け取り、ロードしたitemを適用している
      this.trigger('ready')
    }
  }
}