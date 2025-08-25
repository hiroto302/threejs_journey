import { RigidBody } from "@react-three/rapier"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { useRef, useEffect } from "react"

export default function Player()
{
  const body = useRef()

  // const { forward, backward, leftward, rightward, jump } = useKeyboardControls()
  const [ subscribeKeys, getKeys ] = useKeyboardControls()

  const jump = () => {
    body.current.applyImpulse({ x: 0, y: 0.5, z: 0 })
  }

  useEffect(() =>
  {
    subscribeKeys(
      // jumpの状態が変化したときに呼ばれる
      (state) =>
      {
        return state.jump
      },
      // jumpが押されたときに呼ばれる
      (value) =>
      {
        console.log('jump', value)
        if(value) {
          jump()
        }
      }
    )
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