import { useGLTF, useAnimations } from '@react-three/drei'
import { useEffect } from 'react'
import { useControls } from 'leva'

export default function Fox()
{
    const fox = useGLTF('./Fox/glTF/Fox.gltf')
    const animations = useAnimations(fox.animations, fox.scene)

    const { animationName } = useControls({
        animationName: {
            options: Object.keys(animations.actions),
            value: 'Run'}
    })



    /* NOTE: アニメーション切り替えの流れ
        「Run」再生中 → 「Walk」選択
        1. fadeOut(0.5) : 「Run」が0.5秒でフェードアウト
        2. reset()       : 「Walk」を0秒地点にリセット
        3. fadeIn(0.5)   : 「Walk」が0.5秒でフェードイン
        4. play()        : 「Walk」再生開始
    */
    useEffect(() => {
        const action = animations.actions[animationName]
        //NOTE: action.reset() is used to reset the animation state
        action.reset().fadeIn(0.5).play()

        return () => {

            action.fadeOut(0.5)
        }
    }, [animationName])

    return <>
        <primitive
            object={ fox.scene }
            scale={ 0.02 }
            position={ [0 , -1, 0] }
            rotation-y={ 0.3 } />
    </>
}