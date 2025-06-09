import * as THREE from 'three'
import Sizes from "./Utils/Sizes"
import Time from "./Utils/Time"
import Camera from './Camera'
import Renderer from './Renderer'

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

    console.log("Here starts a great experience")

    //NOTE: Global Access. コンソールに experience と打つと、クラスのインスタンス情報が見れる
    window.experience = this

    // Options
    this.canvas = canvas

    // Setup
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new THREE.Scene()
    this.camera = new Camera()
    this.renderer = new Renderer()

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
    this.renderer.update()
  }
}