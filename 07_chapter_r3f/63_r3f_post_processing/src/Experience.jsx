import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { ToneMapping, EffectComposer, Vignette, Glitch } from '@react-three/postprocessing'
import { ToneMappingMode, BlendFunction, GlitchMode } from 'postprocessing'


/*NOTE: EffectComposer について
- mode設定は最後に行う必要があることに注意
*/

export default function Experience()
{
    return <>
        <color args={ ['#ffffff'] } attach="background" />

        <EffectComposer>
            <Vignette
                offset={ 0.3 }
                darkness={ 0.9 }
                blendFunction={ BlendFunction.NORMAL }
            />
            <Glitch
                delay={[ 0.5, 1 ]}
                duration={[ 0.1, 0.3 ]}
                strength={[ 0.02, 0.04 ]}
                mode={ GlitchMode.CONSTANT_WILD }
                // active
            />
            {/* <ToneMapping mode={ ToneMappingMode.ACES_FILMIC }/> */}
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

    </>
}