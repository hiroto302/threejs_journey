import { useFrame } from '@react-three/fiber'
import { SoftShadows ,BakeShadows, OrbitControls, useHelper } from '@react-three/drei'
import { useRef } from 'react'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'

export default function Experience()
{
    const directionalLight = useRef()
    useHelper(directionalLight, THREE.DirectionalLightHelper, 0.5)
    const cube = useRef()

    useFrame((state, delta) =>
    {
        cube.current.rotation.y += delta * 0.2
    })

    return <>

        {/* <BakeShadows /> */}
        {/* frustum={3.75} near={9.5} rings={11} はデフォルト値が反映されているよ */}
        {/* <SoftShadows size={ 25 } samples={ 10 } focus={ 0 } /> */}

        <color args={ ['ivory'] } attach="background" />

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight
            ref={ directionalLight }
            position={ [ 1, 2, 3 ] }
            intensity={ 4.5 }
            castShadow
            shadow-mapSize={ [1024, 1024] }
            // shadow-camera-near={ 1.0 }
            // shadow-camera-far={ 20 }
            // shadow-camera-top={ 200 }
            // shadow-camera-left={ - 200 }
            // shadow-camera-right={ 200 }
            // shadow-camera-bottom={ -200 }
        />
        <ambientLight intensity={ 1.5 } />

        <mesh castShadow position-x={ - 2 }>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>

        <mesh castShadow ref={ cube } position-x={ 2 } scale={ 1.5 }>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>

        <mesh position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
        {/* <mesh receiveShadow position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }> */}

            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

    </>
}