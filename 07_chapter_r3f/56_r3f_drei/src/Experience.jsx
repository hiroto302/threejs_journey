import {
    MeshReflectorMaterial,
    Float,
    Text,
    Html,
    PivotControls,
    TransformControls,
    OrbitControls } from "@react-three/drei"

import { useRef } from 'react'

export default function Experience()
{
    const cube = useRef()
    const sphere = useRef()

    return <>
        <OrbitControls enableDamping={false} makeDefault />

        <directionalLight position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
        <ambientLight intensity={ 1.5 } />

        <PivotControls
            anchor={ [ 0, 0, 0 ] }
            depthTest={ false }
            lineWidth={ 1 }
            scale={ 50 }
            fixed={ true }
        >
            <mesh ref={ sphere} position-x={ - 2 }>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
                <Html
                    position={ [1, 1.2, 0]}
                    wrapperClass="label" // 親要素にlabelクラスを適用
                    center
                    distanceFactor={ 6 }
                    occlude={ [cube, sphere] }
                >
                {/* 以下の要素が div に配置される */}
                    OrangeSphere
                </Html>
            </mesh>
        </PivotControls>

        <mesh ref={ cube } position-x={ 2 } scale={ 1.5 }>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>
        <TransformControls object={ cube } mode='translate' />

        <mesh position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
            <MeshReflectorMaterial
                resolution={ 512 }
                blur={ [1000, 1000 ] }
                mixBlur={ 1 }
                mirror={ 0.8 }
                color= "greenYellow"
            />
        </mesh>

        <Float
            speed={ 1.5 }
            rotationIntensity={ 0.5 }
            floatIntensity={ 2 }
        >
            <Text
                font="/bangers-v20-latin-regular.woff"
                fontSize={ 1 }
                color='salmon'
                position={ [ 0, 2, 0 ] }
                maxWidth={ 2 }
                textAlign='center'
            >
                I LOVE R3F
            </Text>
        </Float>
    </>
}