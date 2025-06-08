import Sizes from "./Utils/Sizes"

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
  }
}