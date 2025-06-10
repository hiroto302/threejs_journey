import * as THREE from 'three'
import Experience from "../Experience";
import Environment from './Environment';
import Floor from './Floor';

export default class World
{
  constructor()
  {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    const testMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ wireframe: false })
    )
    this.scene.add(testMesh)

    this.resources.on('ready', () =>
    {
      console.log('Resources are ready')

      // Setup
      /* NOTE: Environment のインスタンス生成時に、EnvironmentMap の影響を与える処理を今回は実装しているので、
            インスタンス化してSceneに追加する順序を、Environmentを最後にすること
      */
      this.floor = new Floor()
      this.environment = new Environment()
    })
  }


}