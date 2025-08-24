import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Physics, RigidBody, CuboidCollider, BallCollider } from '@react-three/rapier'
import { TorusGeometry } from 'three'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* Physics について

Colliders について
- box:　デフォルトで適用される。立方体のメッシュに対して使用。計算コストが低く、動的なオブジェクトに適している。
- trimesh:　複雑な形状のメッシュに対して使用。計算コストが高いので、dyamic なオブジェクトにはあまり適していない。

Gravity について
- gravity={ [ 0, -9.81, 0 ] } がデフォルトの値です。Y軸方向に-9.81の重力がかかります。
- gravityScale: 重力の影響を調整するために使用。1がデフォルト値で、0に設定すると重力の影響を受けなくなります。 -0.2に設定すると、物体が浮かび上がる。

restitutionについて
- 反発係数。物体が衝突した際の跳ね返りの度合いを制御します。0から1の範囲で設定し、1に近いほど跳ね返りが大きくなります。
- 例えば、restitution={1}に設定すると、物体が衝突した際に完全に跳ね返ります。0に設定すると、跳ね返りがなくなります。

Friction について
- 摩擦係数。物体が接触している面との摩擦の度合いを制御します。0から1の範囲で設定し、1に近いほど摩擦が大きくなります。
- 例えば、friction={1}に設定すると、物体が接触している面との摩擦が非常に大きくなり、動きにくくなります。0に設定すると、摩擦がなくなり、物体が滑りやすくなります。
- 床と立方体の両方にfriction={0}を設定すると、氷上のような滑りやすい動きを表現できます

kinematic について
- kinematic なオブジェクトは、物理エンジンの影響を受けず、自分で位置や回転を制御します。これにより、動的なオブジェクトと衝突しても影響を受けません。
- 例えば、一定のアニメーションをさせたいときや、プレイヤーが操作するキャラクターなどに使用されます。
*/


export default function Experience()
{
    const [ hitSound ] = useState(() => new Audio('./hit.mp3'))
    console.log(hitSound)

    const cube = useRef()
    const twister = useRef()

    const cubeJump = () =>
    {
        // console.log(cube.current)
        console.log('jump')
        cube.current.applyImpulse({ x: 0, y: 5, z: 0 })
        cube.current.applyTorqueImpulse({ x: 0, y: 1, z: 0 })
    }

    useFrame((state, delta) =>
    {
        const time = state.clock.getElapsedTime()
        const eulerRotation = new THREE.Euler(0, time * 3, 0)
        const quaternionRotation = new THREE.Quaternion()
        quaternionRotation.setFromEuler(eulerRotation)

        twister.current.setNextKinematicRotation(quaternionRotation)

        const angle = time * 0.5
        const x = Math.cos(angle) * 2
        const z = Math.sin(angle) * 2
        twister.current.setNextKinematicTranslation({ x: x, y: -0.8, z: z })
    })

    const collisionEnter = () =>
    {
        console.log('collision')
        hitSound.currentTime = 0
        hitSound.volume = Math.random()
        hitSound.play()
    }

    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
        <ambientLight intensity={ 1.5 } />

        <Physics debug gravity={ [ 0, -9.81, 0 ] }>
        {/* 球体 */}
            <RigidBody colliders="ball">
                <mesh castShadow position={ [ -2, 4, 0 ] }>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>

        {/* トーラス 複雑なメッシュを適用*/}
            {/* <RigidBody colliders="trimesh">
                <mesh castShadow position={ [ 0, 1, 0 ] } rotation={ [ Math.PI * 0.5, 0, 0 ] }>
                    <torusGeometry args={ [1, 0.5, 16, 32] } />
                    <meshStandardMaterial color="hotpink" />
                </mesh>
            </RigidBody> */}

        {/* トーラス カスタムコライダーを適用*/}
            {/* <RigidBody colliders={false} position={ [ 0, 1, 0 ] } rotation={ [ Math.PI * 0.5, 0, 0 ] }>
                <CuboidCollider args={ [1.5, 1.5, 0.5] } />
                <mesh castShadow  >
                    <torusGeometry args={ [1, 0.5, 16, 32] } />
                    <meshStandardMaterial color="hotpink" />
                </mesh>
            </RigidBody> */}

        {/* 立方体 合成*/}
            {/* <RigidBody>
                <mesh castShadow position={ [ 2, 2, 0 ] } >
                    <boxGeometry args={ [3, 2, 1] } />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
                <mesh castShadow position={ [ 2, 2, 4 ] } >
                    <boxGeometry args={ [1, 1, 1] } />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
            </RigidBody> */}

        {/* 立方体 ジャンプ & Apply Object Settings */}
            <RigidBody
                    ref={ cube }
                    position={ [ 1.8, 2.0, 0 ] }
                    gravityScale={ 1 }
                    restitution={ 0 }
                    friction={ 0 }      // 摩擦をなくす氷上のような床を表現
                    colliders={false}   // カスタムコライダーを使用するためにfalseに設定
                    onCollisionEnter={ collisionEnter }
                    // onCollisionExit={ () => console.log('exit') }
                    onSleep={ () => console.log('sleep') }
                    onWake={ () => console.log('wake') }
                >
                <mesh castShadow onClick={ cubeJump } >
                    <boxGeometry args={ [1, 1, 1] } />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
                <CuboidCollider
                    args={ [0.5, 0.5, 0.5] }
                    mass={ 1 }
                />
            </RigidBody>

        {/* 棒 kinematic */}
        <RigidBody
            ref={ twister }
            position={ [ 0, -0.8, 0] }
            friction={ 0 }      // 摩擦をなくす氷上のような床を表現
            type='kinematicPosition'
        >
            <mesh castShadow scale={[0.4, 0.4, 3]}>
                <boxGeometry />
                <meshStandardMaterial color="red" />
            </mesh>
        </RigidBody>

        {/* 床 */}
            <RigidBody
                type='fixed'
                // friction={ 0 } // 摩擦をなくす氷上のような床を表現
                friction={ 0.7 }
            >
                <mesh receiveShadow position-y={ - 1.25 }>
                    <boxGeometry args={ [ 10, 0.5, 10 ] } />
                    <meshStandardMaterial color="greenyellow" />
                </mesh>r
            </RigidBody>
        </Physics>
    </>
}