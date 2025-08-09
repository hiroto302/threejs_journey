import { useFrame } from '@react-three/fiber'
import { Sky ,ContactShadows ,RandomizedLight ,AccumulativeShadows , SoftShadows ,BakeShadows , OrbitControls, useHelper } from '@react-three/drei'
import { useRef } from 'react'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import { useControls } from 'leva'

export default function Experience()
{
    const directionalLight = useRef()
    useHelper(directionalLight, THREE.DirectionalLightHelper, 0.5)
    const cube = useRef()

    useFrame((state, delta) =>
    {
        cube.current.rotation.y += delta * 0.2
        // const time = state.clock.getElapsedTime()
        // cube.current.position.x = 2 + Math.sin(time)
    })

    const { color, opacity, blur } = useControls('contact shadows', {
        color: '#b9cb25',
        opacity: { value: 0.77, min: 0, max: 1, step: 0.01 },
        blur: { value: 1.47, min: 0, max: 10, step: 0.1 }
    })

    const { sunPosition, sunIntensity } = useControls('sky', {
        sunPosition: { value: [ 1, 2, 3 ], step: 0.01 },
        sunIntensity: { value: 4.5, min: 0, max: 10, step: 0.01 }
    })

    return <>

        {/* <BakeShadows /> */}
        {/* frustum={3.75} near={9.5} rings={11} はデフォルト値が反映されているよ */}
        {/* <SoftShadows size={ 25 } samples={ 10 } focus={ 0 } /> */}

        <color args={ ['ivory'] } attach="background" />

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        {/* <AccumulativeShadows
            position={ [ 0, - 0.99, 0 ] }
            scale={ 10 }
            color="#316d39"
            opacity={ 0.8 }
            frames={ Infinity }
            temporal
            blend={ 100 }
        >
            <RandomizedLight
                amount={ 8 }
                radius={ 1 }
                ambient={ 0.5 }
                intensity={ 3 }
                position={ [ 1, 2, 3 ] }
                bias={ 0.001 }
            />
        </AccumulativeShadows> */}

        <ContactShadows
            position={ [ 0, -0.99, 0]}
            scale={ 10 }
            resolution={ 512 }
            far={ 5 }
            color={ color }
            opacity={ opacity }
            blur={ blur }
            frames={ 1 }
        />

        <directionalLight
            ref={ directionalLight }
            position={ sunPosition }
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

        <Sky sunPosition={ sunPosition }/>

        <mesh castShadow position-x={ - 2 }>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>

        <mesh castShadow ref={ cube } position-x={ 2 } scale={ 1.5 }>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>

        <mesh position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
        {/* <mesh receiveShadow position- y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }> */}

            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

    </>
}