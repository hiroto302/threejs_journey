import './style.css'
import ReactDOM from 'react-dom/client'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience'

const root = ReactDOM.createRoot(document.querySelector('#root'))

//NOTE: Native Three.js example
// const mesh =  new THREE.Mesh()
// mesh.position.set(0, 0, 0)
// mesh.rotation.x = 0.5
// mesh.geometry = new THREE.BoxGeometry(1, 1, 1)
// mesh.material = new THREE.MeshBasicMaterial({ color: red })
// scene.add(mesh)

//NOTE: React Three Fiber example
root.render(
    <>
        <Canvas>
            <Experience />
        </Canvas>
    </>
)