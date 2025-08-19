import { useThree ,useFrame } from '@react-three/fiber'
import { Lightformer ,Environment ,Sky ,ContactShadows ,RandomizedLight ,AccumulativeShadows , SoftShadows ,BakeShadows , OrbitControls, useHelper } from '@react-three/drei'
import { useEffect ,useRef } from 'react'
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

    const scene = useThree((state) => state.scene)
    useEffect(() =>
    {
        scene.environmentIntensity = envMapIntensity
    }, [ envMapIntensity ])

    return <>

        {/* 'https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr', この hdr試してみたい */}
        <Environment
            background={ true }
            // files={ [
            //     './environmentMaps/2/px.jpg',
            //     './environmentMaps/2/nx.jpg',
            //     './environmentMaps/2/py.jpg',
            //     './environmentMaps/2/ny.jpg',
            //     './environmentMaps/2/pz.jpg',
            //     './environmentMaps/2/nz.jpg',
            // ]}
            // files={ './environmentMaps/the_sky_is_on_fire_2k.hdr' }
            preset='sunset'
            ground={{
                height: envMapHeight,
                radius: envMapRadius,
                scale: envMapScale,
                // offset: [ 0, - 0.5, 0 ]
            }}
            // resolution={ 32 }
        >

            {/* <color args={ ['#000000'] } attach="background" />
            <Lightformer
                position-z={ -5 }
                scale={ 10 }
                color='red'
                intensity={ 2 }
                form='ring'
            /> */}
            {/* NOTE: EnvMap として Bright する Plane を作成 Lightformer を上記のように利用すればOK*/}
            {/* <mesh position-z={ -5 } scale={ 10}>
                <planeGeometry />
                <meshBasicMaterial color={ [1, 0, 0]} />
            </mesh> */}
        </Environment>

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
            position={ [ 0, 0, 0]}
            scale={ 10 }
            resolution={ 512 }
            far={ 5 }
            color={ color }
            opacity={ opacity }
            blur={ blur }
            frames={ 1 }
        />

        {/* NOTE: Environment Map を使うので以下をコメントアウト */}
        {/* <directionalLight
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
        /> */}
        {/* <ambientLight intensity={ 1.5 } /> */}

        {/* <Sky sunPosition={ sunPosition }/> */}

        <mesh castShadow position-x={ - 2 } position-y={ 1 }>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>

        <mesh castShadow ref={ cube } position-x={ 2 } position-y={ 1 } scale={ 1.5 }>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>

        <mesh position-y={ 0 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
        {/* <mesh receiveShadow position- y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }> */}

            {/* <planeGeometry />
            <meshStandardMaterial color="greenyellow" /> */}
        </mesh>

    </>
}