import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Suspense } from 'react'
import Model from './Model.js'
import Placeholder  from './Placeholder.js'
import Hamburger from './Hamburger.js'
import Fox from './Fox.js'

export default function Experience()
{


    return <>
        <Perf position="top-left" />

        <OrbitControls makeDefault />

        {/* shadow-normalBia　s for Shadow acne (ハンバーガーの影のアクネを防ぐための設定) */}
        <directionalLight castShadow position={ [ 1, 2, 3 ] } intensity={ 4.5 } shadow-normalBias= { 0.04 } />
        <ambientLight intensity={ 1.5 } />

        <mesh receiveShadow position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

        <Suspense
            fallback={
                <Placeholder position-y={ 0.5 } scale={[2, 3, 2]} />
            }
        >
            {/* <Model /> */}
            {/* <Hamburger position-x={ 0 } scale={ 0.35 } /> */}
            <Fox />
        </Suspense>
    </>
}