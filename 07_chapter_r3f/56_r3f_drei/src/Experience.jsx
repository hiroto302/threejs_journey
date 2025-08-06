import {
    PivotControls,
    TransformControls,
    OrbitControls } from "@react-three/drei"

import { useRef } from 'react'

export default function Experience()
{
    const cube = useRef()

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
            <mesh position-x={ - 2 }>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
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
        </mesh>

    </>
}