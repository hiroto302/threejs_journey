import { useRapier , RigidBody } from "@react-three/rapier"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { useRef, useEffect } from "react"

export default function Player()
{
  console.log('Player Reloaded')
  const body = useRef()

  // const { forward, backward, leftward, rightward, jump } = useKeyboardControls()
  const [ subscribeKeys, getKeys ] = useKeyboardControls()

  const { rapier, world } = useRapier()
  // Point: world.raw() gives access to the underlying Rapier physics world だったが、現在は、world自体がrawになっている
  // なので、world.raw()ではなく、worldで良い

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

  useEffect(() =>
  {
    console.log('useEffect')
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

    return () => {
      unsubscribeJump()
    }
  }, [ ])

  useFrame((state, delta) => {
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