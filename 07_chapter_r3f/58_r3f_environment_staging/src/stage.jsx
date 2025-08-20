import { useThree ,useFrame } from '@react-three/fiber'
import { Stage ,Lightformer ,Environment ,Sky ,ContactShadows ,RandomizedLight ,AccumulativeShadows , SoftShadows ,BakeShadows , OrbitControls, useHelper } from '@react-three/drei'
import { useEffect ,useRef } from 'react'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import { useControls } from 'leva'

export default function stage()
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
        color: '#4b2709',
        opacity: { value: 0.77, min: 0, max: 1, step: 0.01 },
        blur: { value: 1.47, min: 0, max: 10, step: 0.1 }
    })

    const { sunPosition, sunIntensity } = useControls('sky', {
        sunPosition: { value: [ 1, 2, 3 ], step: 0.01 },
        sunIntensity: { value: 4.5, min: 0, max: 10, step: 0.01 }
    })

    const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } = useControls('environment map', {
        envMapIntensity: { value: 3.5, min: 0, max: 10},
        envMapHeight: { value: 7, min: 0, max: 100, step: 0.1 },
        envMapRadius: { value: 28, min: 10, max: 1000, step: 0.1 },
        envMapScale: { value: 100, min: 10, max: 1000, step: 1 }
    })


    //The intensity will also update the scene.envMapIntensity like we did earlier. To prevent conflicts, we are going to comment our implementation.
    // const scene = useThree((state) => state.scene)
    // useEffect(() =>
    // {
    //     scene.environmentIntensity = envMapIntensity
    // }, [ envMapIntensity ])

    return <>
        {/* <BakeShadows /> */}
        {/* frustum={3.75} near={9.5} rings={11} はデフォルト値が反映されているよ */}
        {/* <SoftShadows size={ 25 } samples={ 10 } focus={ 0 } /> */}

        {/* <color args={ ['ivory'] } attach="background" /> */}

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <Stage
            shadows={ {
                type: 'contact',
                opacity: 0.2,
                color: '#4b2709',
                blur: 3
              }
            }
            environment='sunset'
            preset='portrait'
            intensity={ envMapIntensity }
        >
          <mesh castShadow position-x={ - 2 } position-y={ 1 }>
              <sphereGeometry />
              <meshStandardMaterial color="orange" />
          </mesh>

          <mesh castShadow ref={ cube } position-x={ 2 } position-y={ 1 } scale={ 1.5 }>
              <boxGeometry />
              <meshStandardMaterial color="mediumpurple" />
          </mesh>
        </Stage>
    </>
}