import { OrbitControls, useGLTF, Environment, Float } from '@react-three/drei'

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

        <OrbitControls makeDefault />

        <Float rotationIntensity={0.4}>
            <primitive
                object={ computer.scene }
                position-y={ -1.2 }
            />
        </Float>

    </>
}