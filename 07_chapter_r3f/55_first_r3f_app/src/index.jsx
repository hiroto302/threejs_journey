import './style.css'
import ReactDOM from 'react-dom/client'
import * as THREE from 'three'
import { CineonToneMapping } from 'three'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience'
import { toneMapping } from 'three/tsl'

const root = ReactDOM.createRoot(document.querySelector('#root'))

//NOTE: Native Three.js example
// const mesh =  new THREE.Mesh()
// mesh.position.set(0, 0, 0)
// mesh.rotation.x = 0.5
// mesh.geometry = new THREE.BoxGeometry(1, 1, 1)
// mesh.material = new THREE.MeshBasicMaterial({ color: red })
// scene.add(mesh)

const cameraSettings = {
    fov: 45,
    near: 0.1,
    far: 200,
    position: [3, 2, 6],
    // zoom: 50 // Uncomment for orthographic camera
}

//NOTE: React Three Fiber example
root.render(
    <>
        <Canvas
            //NOTE: toneMapping default is THREE.ACESFilmicToneMapping. 色々なパターンがあるので試してみると良い。
            // flat
            //NOTE: gl = WebGLRenderer
            gl={{
                antialias: true,
                // toneMapping: CineonToneMapping
                toneMapping: THREE.ACESFilmicToneMapping,
                outputColorSpace: THREE.SRGBColorSpace,
            }}

            // orthographic
            camera={ cameraSettings}
        >
            <Experience />
        </Canvas>
    </>
)