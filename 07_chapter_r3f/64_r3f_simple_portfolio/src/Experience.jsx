import { OrbitControls, PresentationControls, useGLTF, Environment, Float, ContactShadows, Html } from '@react-three/drei'

/*NOTE: 使用するモデル
CDNから直接読み込むか、ローカルに保存(./public以下)して使用してください
もしくは、React Three Fiber > Copy JSX Scene Graph などで取得したコードを使用してください

- MacBook Pro 3Dモデル
https://market.pmnd.rs/model/macbook
    - CDN
    https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf

-  PMNDRs market がダウンしている場合は、以下のURLを使用してください
const computer = useGLTF('https://threejs-journey.com/resources/models/macbook_model.gltf')
*/

export default function Experience()
{
    const computer = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf')
    console.log(computer)

    return <>
        <Environment preset="city" />
        <color attach="background" args={['#241a1a']} />

        <PresentationControls
            global
            rotation={[0.13, 0.1, 0]}
            polar={[-0.4, 0.2]}
            azimuth={[-1, 0.75]}
            damping={0.1}
            config={{ mass: 2, tension: 400}}
            snap
        >
            <Float rotationIntensity={0.4}>
                <rectAreaLight
                        width={ 2.5 }
                        height={ 1.65 }
                        intensity={ 20 }
                        color={ '#ff6900' }
                        rotation={ [ - 0.1, Math.PI, 0 ] }
                        position={ [ 0, 0.55, - 1.15 ] }
                />
                <primitive
                    object={ computer.scene }
                    position-y={ -1.2 }
                >
                    <Html
                        transform
                        wrapperClass="htmlScreen"
                        distanceFactor={ 1.17 }
                        position={[0, 1.56, -1.4]}
                        rotation-x={ -0.256 }
                    >
                        <iframe
                            src="https://bruno-simon.com/html/"

                        />
                    </Html>
                </primitive>
            </Float>
        </PresentationControls>

        <ContactShadows
            position-y={ -1.4 }
            opacity={0.4}
            scale={5}
            blur={2.4}
        />

    </>
}