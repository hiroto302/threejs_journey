import * as THREE from 'three'
import Experience from "../Experience";
import Environment from './Environment';

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
      this.environment = new Environment()
    })
  }
}