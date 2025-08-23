import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { ToneMapping, EffectComposer, Vignette, Glitch, Noise, Bloom, DepthOfField } from '@react-three/postprocessing'
import { ToneMappingMode, BlendFunction, GlitchMode } from 'postprocessing'
import { texture3D } from 'three/src/nodes/TSL.js'
import Drunk from './Drunk'
import { useRef } from 'react'


/* NOTE: Post-processing について
EffectComposer
- mode設定は最後に行う必要があることに注意

Bloom
- luminanceThreshold: 輝度の閾値。1.0より高い値に設定すると、非常に明るい部分のみがブルーム効果の対象となる。
    1.0以下に設定すると、より多くの部分が影響を受ける。
- <meshStandardMaterial color={[1.5, 1, 4]} toneMapped={false}/> のように、
    toneMappedをfalseにすると、マテリアルがトーンマッピングの影響を受けなくなる。これにより、ブルーム効果が強調される。
*/

export default function Experience()
{
    const drunkRef = useRef()

    return <>
        {/* <color args={ ['#000000'] } attach="background" /> */}
        <color args={ ['#ffffff'] } attach="background" />

        <EffectComposer>
            {/* <Vignette
                offset={ 0.3 }
                darkness={ 0.9 }
                blendFunction={ BlendFunction.NORMAL }
            /> */}
            {/* <Glitch
                delay={[ 1, 1.5 ]}
                duration={[ 0.1, 0.3 ]}
                strength={[ 0.02, 0.04 ]}
                mode={ GlitchMode.CONSTANT_MIX }
            /> */}
            {/* <Noise
                premultiply
                blendFunction={ BlendFunction.AVERAGE }
                opacity={ 1.7 }
            /> */}
            {/* <Bloom
                luminanceThreshold={ 1.1 }
                mipmapBlur={ true }
                intensity={ 1.0 }
            /> */}
            {/* <DepthOfField
                focusDistance={ 0.025 }
                focalLength={ 0.025 }
                bokehScale={ 6 }
            /> */}

            <Drunk
                ref={ drunkRef }
                frequency={ 10.0 }
                amplitude={ 0.1 }
            />

            <ToneMapping mode={ ToneMappingMode.ACES_FILMIC }/>

        </EffectComposer>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
        <ambientLight intensity={ 1.5 } />

        <mesh castShadow position-x={ - 2 }>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>

        <mesh castShadow position-x={ 2 } scale={ 1.5 }>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>

        <mesh receiveShadow position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

        {/* Bloom の効果を確認するために toneMapped を false に変更 */}
        <mesh castShadow position-x={ 2 * 4 } scale={ 1.5 }>
            <boxGeometry />
            <meshStandardMaterial color={[1.5, 1, 4]} toneMapped={false}/>
            {/* <meshStandardMaterial color='orange' emissive='orange' emissiveIntensity={2} toneMapped={false}/> */}
        </mesh>

    </>
}