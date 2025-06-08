import Sizes from "./Utils/Sizes"
import Time from "./Utils/Time"

export default class Experience
{
  constructor(canvas)
  {
    console.log("Here starts a great experience")

    //NOTE: Global Access. コンソールに experience と打つと、クラスのインスタンス情報が見れる
    window.experience = this

    // Options
    this.canvas = canvas

    // Setup
    this.sizes = new Sizes()
    this.time = new Time()

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
  }

  update()
  {
    // console.log("Experience.js heard a Time Event with Tick")
  }
}