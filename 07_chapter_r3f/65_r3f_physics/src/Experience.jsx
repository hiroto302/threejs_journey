import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Physics, RigidBody, CuboidCollider, BallCollider } from '@react-three/rapier'
import { TorusGeometry } from 'three'


/* Colliders について
- box:　デフォルトで適用される。立方体のメッシュに対して使用。計算コストが低く、動的なオブジェクトに適している。
- trimesh:　複雑な形状のメッシュに対して使用。計算コストが高いので、dyamic なオブジェクトにはあまり適していない。
*/


export default function Experience()
{
    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
        <ambientLight intensity={ 1.5 } />

        <Physics debug>
        {/* 球体 */}
            <RigidBody colliders="ball">
                <mesh castShadow position={ [ 0, 4, 0 ] }>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>

        {/* トーラス 複雑なメッシュを適用*/}
            <RigidBody colliders="trimesh">
                <mesh castShadow position={ [ 0, 1, 0 ] } rotation={ [ Math.PI * 0.5, 0, 0 ] }>
                    <torusGeometry args={ [1, 0.5, 16, 32] } />
                    <meshStandardMaterial color="hotpink" />
                </mesh>
            </RigidBody>

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

        {/* 床 */}
            <RigidBody type='fixed'>
                <mesh receiveShadow position-y={ - 1.25 }>
                    <boxGeometry args={ [ 10, 0.5, 10 ] } />
                    <meshStandardMaterial color="greenyellow" />
                </mesh>r
            </RigidBody>
        </Physics>
    </>
}