import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import Experience from './Experience.jsx'

const root = ReactDOM.createRoot(document.querySelector('#root'))

// NOTE: created func は Canvas の attributeとして渡すことができる。onCreated イベントは Canvas が初期化されたときに呼び出される。
// state には Canvas の状態が含まれる。
// 例えば、カメラの設定やレンダリングの設定などが含まれる。
// state ではなく、{ camera, gl } のように、Canvas の状態を直接受け取ることもできる。
const created = ({ gl, scene }) => {
    // gl.setClearColor('#ff0000', 1.0)
    // scene.background = new THREE.Color('#0000ff')
}


root.render(
    <Canvas
        camera={ {
            fov: 45,
            near: 0.1,
            far: 200,
            position: [ - 4, 3, 6 ]
        } }
        onCreated={ created }
        >
        <color args={ ['red']} attach="background"/>
        <Experience />
    </Canvas>
)