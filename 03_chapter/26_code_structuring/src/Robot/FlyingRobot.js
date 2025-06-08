//NOTE: ここで忘れずにImport しようね！
import { Robot } from "./Robot.js"

/**
 * Inheritance
 */
export class FlyingRobot extends Robot
{
  constructor(name, legs)
  {
    //NOTE: super は base クラスとなっている Robot を指す。ここは、Robot のコスんトラクタを実行している。
    super(name, legs)
    super.intro()
    this.fly()
  }

  fly()
  {
    console.log("I can fly !!!!!!!!")
  }
}