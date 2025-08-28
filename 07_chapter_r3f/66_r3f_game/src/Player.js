import { useRapier , RigidBody } from "@react-three/rapier"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import useGame from "./stores/useGame.js"

console.log(useGame.subscribe) // subscribeWithSelectorが正しく動作しているか確認するためのログ

export default function Player()
{
  const body = useRef()

  // const { forward, backward, leftward, rightward, jump } = useKeyboardControls()
  const [ subscribeKeys, getKeys ] = useKeyboardControls()

  const { rapier, world } = useRapier()
  // Point: world.raw() gives access to the underlying Rapier physics world だったが、現在は、world自体がrawになっている
  // なので、world.raw()ではなく、worldで良い

  const [ smoothedCameraPosition ] = useState(() => new THREE.Vector3(10, 10, 10))
  const [ smoothedCameraTarget ] = useState(() => new THREE.Vector3())

  const start = useGame((state) => state.start)
  const end = useGame((state) => state.end)
  const restart = useGame((state) => state.restart)
  const blocksCount = useGame((state) => state.blocksCount)

  const jump = () => {
    // Pint: ダブルジャンプ防止
    const origin = body.current.translation()
    origin.y -= 0.31
    const direction = { x: 0, y: -1, z: 0 }
    const ray = new rapier.Ray(origin, direction)
    const hit = world.castRay(ray, 10, true) // trueにすることで、最初にヒットしたオブジェクトだけを取得する
    // console.log('hit', hit.timeOfImpact)

    if(hit.timeOfImpact < 0.15)
    {
      body.current.applyImpulse({ x: 0, y: 0.5, z: 0 })
    }
  }

  const reset = () => {
    console.log('reset')
    body.current.setTranslation({ x: 0, y: 1, z: 0 })
    body.current.setLinvel({ x: 0, y: 0, z: 0 })
    body.current.setAngvel({ x: 0, y: 0, z: 0 })
  }

  useEffect(() =>
  {
    const unSubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (value) =>
      {
        console.log('phase changed to', value)
        if(value === 'ready')
        {
          reset()
        }
        // else if(value === 'ended')
        // {
        //   const impulse = { x: (Math.random() - 0.5) * 2, y: 0.5, z: (Math.random() - 0.5) * 2 }
        //   const torque = { x: (Math.random() - 0.5) * 0.2, y: (Math.random() - 0.5) * 0.2, z: (Math.random() - 0.5) * 0.2 }
        //   body.current.applyImpulse(impulse)
        //   body.current.applyTorqueImpulse(torque)
        // }
      }
    )

    const unsubscribeJump = subscribeKeys(
      // 第一引数は、stateを受け取る関数で、stateはuseKeyboardControlsの中の状態を表す
      // ここでは、jumpの状態を監視する
      (state) =>
      {
        return state.jump
      },
      // 第二引数は、状態が変化したときに呼び出される関数で、valueは新しい状態の値を表す
      // ここでは、jumpが押されたとき(状態が変化した時)に呼び出される
      (value) =>
      {
        // console.log('jump')
        if(value) {
          jump()
        }
      }
    )

    const unsubscribeAny =  subscribeKeys(
      () =>
      {
        // console.log('any key pressed')
        start()
      }
    )

    return () => {
      unSubscribeReset()
      unsubscribeJump()
      unsubscribeAny()
    }
  }, [ ])

  useFrame((state, delta) => {

    // Controls
    const { forward, backward, leftward, rightward } = getKeys()

    const impulse = { x: 0 , y: 0, z: 0 }
    const torque = { x: 0, y: 0, z: 0 }

    const impulseStrength = 0.6 * delta
    const torqueStrength = 0.2 * delta

    if(forward) {
      impulse.z -= impulseStrength
      torque.x -= torqueStrength
    }
    if(rightward) {
      impulse.x += impulseStrength
      torque.z -= torqueStrength
    }
    if(backward) {
      impulse.z += impulseStrength
      torque.x += torqueStrength
    }
    if(leftward) {
      impulse.x -= impulseStrength
      torque.z += torqueStrength
    }

    body.current.applyImpulse(impulse)
    body.current.applyTorqueImpulse(torque)

    // Camera
    const bodyPosition = body.current.translation()
    const cameraPosition = new THREE.Vector3()
    cameraPosition.copy(bodyPosition)
    cameraPosition.z += 2.24
    cameraPosition.y += 0.65

    const cameraTarget = new THREE.Vector3()
    cameraTarget.copy(bodyPosition)
    cameraTarget.y += 0.25

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

    state.camera.position.copy(smoothedCameraPosition)
    state.camera.lookAt(smoothedCameraTarget)

    // Phases of the game
    if(bodyPosition.z < -(blocksCount * 4 + 2))
    {
      end()
    }

    if(bodyPosition.y < -4)
    {
      console.log('AAAAAh!!!')
      restart()
    }
  })

  return <>
    {/* NOTE: canSleepをfalseにすることで、常に物理演算を行うようにすることを忘れずに設定すること */}
    <RigidBody
        ref={body}
        canSleep={false}
        position={[0, 1, 0]}
        colliders='ball'
        restitution={0.2}
        friction={1}
        linearDamping={0.5}
      >
      <mesh castShadow>
        <icosahedronGeometry args={ [0.3, 1] } />
        <meshStandardMaterial color='mediumpurple' flatShading />
      </mesh>
    </RigidBody>
  </>
}