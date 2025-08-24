import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Physics, RigidBody } from '@react-three/rapier'


export default function Experience()
{
    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
        <ambientLight intensity={ 1.5 } />

        <Physics debug>
        {/* 球体 */}
            <RigidBody>
                <mesh castShadow position={ [ - 2, 2, 0 ] }>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>

        {/* 立方体 */}
            <mesh castShadow position={ [ 2, 2, 0 ] }>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>

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