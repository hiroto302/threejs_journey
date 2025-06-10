import * as THREE from 'three'
import Experience from "../Experience";
import Environment from './Environment';
import Floor from './Floor';
import Fox from './Fox';

export default class World
{
  constructor()
  {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources



    this.resources.on('ready', () =>
    {
      console.log('Resources are ready')

      // Setup
      /* NOTE: Environment のインスタンス生成時に、EnvironmentMap の影響を与える処理を今回は実装しているので、
            インスタンス化してSceneに追加する順序を、Environmentを最後にすること
      */
      this.floor = new Floor()
      this.fox = new Fox()
      this.environment = new Environment()
    })
  }

  update()
  {
    //POINT: ロードが完了されてから update 実行すること
    if (this.fox)
      this.fox.update()
  }
}