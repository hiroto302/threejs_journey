import * as THREE from 'three'
import Experience from "../Experience";

export default class Fox
{
  constructor()
  {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.time = this.experience.time

    // Setup
    this.resources = this.resources.items.foxModel
    this.setModel()
    this.setAnimation()
  }

  setModel()
  {
    this.model = this.resources.scene
    this.model.scale.set(0.02, 0.02, 0.02)
    this.scene.add(this.model)

    //NOTE: モデルに影を影響させる
    this.model.traverse((child) =>
    {
      if(child instanceof THREE.Mesh)
      {
        child.castShadow = true
      }
    })
  }

  setAnimation()
  {
    this.animation = {}
    this.animation.mixer = new THREE.AnimationMixer(this.model)
    this.animation.action = this.animation.mixer.clipAction(this.resources.animations[0])
    this.animation.action.play()
    //NOTE: update し忘れないこと！ (今回は、Experience.js → World → Fox で updateする)

    // ログを確認して、animations に AnimationClip があるか確認してね
    // console.log(this.resources)
  }

  update()
  {
    //NOTE: delta is in milliseconds. Mixer has been made to handle seconds
    // so, multiply by 0.001 or divide by 1000
    this.animation.mixer.update(this.time.delta * 0.001)
  }
}