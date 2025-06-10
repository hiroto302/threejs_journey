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
    this.debug = this.experience.debug

    // Debug
    if(this.debug.active)
    {
      this.debugFolder = this.debug.ui.addFolder('fox')
      this.debugFolder.close()
    }

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
    // this.animation.action = this.animation.mixer.clipAction(this.resources.animations[0])
    // this.animation.action.play()

    //NOTE: update し忘れないこと！ (今回は、Experience.js → World → Fox で updateする)
    // ログを確認して、animations に AnimationClip があるか確認してね
    // console.log(this.resources)

    //NOTE: 複数のアニメーション再生対応
    // Debug Animation
    this.animation.actions = {}
    this.animation.actions.idle = this.animation.mixer.clipAction(this.resources.animations[0])
    this.animation.actions.walking = this.animation.mixer.clipAction(this.resources.animations[1])
    this.animation.actions.running = this.animation.mixer.clipAction(this.resources.animations[2])

    this.animation.actions.current = this.animation.actions.idle
    this.animation.actions.current.play()

    //NOTE: Cross Fade Animation の実装 (滑らかにアニメーションを切り替える)
    // 検証ツールのConsole に window.experience.world.fox.animation.play('running')などコマンドをうって切り替え確認できる！
    this.animation.play = (name) =>
    {
      const newAction = this.animation.actions[name]
      const oldAction = this.animation.actions.current

      newAction.reset()
      newAction.play()
      newAction.crossFadeFrom(oldAction, 1)

      this.animation.actions.current = newAction
    }

    //NOTE: Debug Fox Animation Actions を Debug GUI への追加
    if(this.debug.active)
    {
      const debugObject = {
        playIdle: () => { this.animation.play('idle')},
        playWalking: () => { this.animation.play('walking')},
        playRunning: () => { this.animation.play('running')}
      }

      this.animationsDebugFolder = this.debugFolder.addFolder('animations')

      this.animationsDebugFolder.add(debugObject, 'playIdle')
      this.animationsDebugFolder.add(debugObject, 'playWalking')
      this.animationsDebugFolder.add(debugObject, 'playRunning')

    }


  }

  update()
  {
    //NOTE: delta is in milliseconds. Mixer has been made to handle seconds
    // so, multiply by 0.001 or divide by 1000
    this.animation.mixer.update(this.time.delta * 0.001)
  }
}