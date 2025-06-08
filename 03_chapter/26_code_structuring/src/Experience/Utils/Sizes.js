import EventEmitter from "./EventEmitter"

export default class Sizes extends EventEmitter
{
  constructor()
  {
    super()

    // Setup
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Resize event
    window.addEventListener('resize', () =>
    {
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        // console.log(this)

        //NOTE: EventEmitter.js のクラスを活用する
        this.trigger('resize')
    })
  }
}