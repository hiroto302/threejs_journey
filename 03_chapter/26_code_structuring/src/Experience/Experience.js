import * as THREE from 'three'
import Sizes from "./Utils/Sizes"
import Time from "./Utils/Time"
import Camera from './Camera'
import Renderer from './Renderer'
import World from './World/World'
import Resources from './Utils/Resources'
import Debug from './Utils/Debug'
import sources from './sources'

//NOTE: Singleton
let instance = null

export default class Experience
{
  constructor(canvas)
  {
    if (instance)
    {
      return instance
    }
    instance = this

    //NOTE: Global Access. コンソールに experience と打つと、クラスのインスタンス情報が見れる
    window.experience = this

    // Options
    this.canvas = canvas

    // Setup
    this.debug = new Debug()
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new THREE.Scene()
    this.resources = new Resources(sources)
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()

    //NOTE: EventEmitter.js のクラスを活用
    this.sizes.on('resize', () =>
    {
      this.resize()
    })

    this.time.on('tick', () =>
    {
      this.update()
    })
  }

  resize()
  {
    console.log('Experience.js heard a Sizes Event with Resize')
    this.camera.resize()
    this.renderer.resize()
  }

  update()
  {
    // console.log("Experience.js heard a Time Event with Tick")

    //POINT: camera → renderer の順序で更新すること
    this.camera.update()
    this.world.update()
    this.renderer.update()
  }

  //NOTE: GPU を考慮する。メモリーリーク対策
  destroy()
  {
    this.sizes.off('resize')
    this.time.off('tick')

    // Traverse the whole scene
    this.scene.traverse((child) =>
    {
      if(child instanceof THREE.Mesh)
      {
        child.geometry.dispose()

        for (const key in child.material)
        {
          const value = child.material[key]
          // console.log(value)

          if(value && typeof value.dispose == 'function')
          {
            value.dispose()
          }
        }
      }
    })

    //WARNING: post-processing を使用しているときは、EffectComposer と WebGLRendererTarget なるものをDisposeする必要があるらしい
    this.camera.controls.dispose()
    this.renderer.instance.dispose()

    if(this.debug.active)
        this.debug.ui.destroy()
  }
}