import { useFrame, extend, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import CustomObject from './CustomObject.js';

extend({ OrbitControls });

export default function Experience() {

    const { camera, gl } = useThree();

    const cubeRef = useRef();
    const groupRef = useRef();

    useFrame((state, delta) =>{
        // console.log(state);

        cubeRef.current.rotation.y += delta;
        // groupRef.current.rotation.y += delta;

        const angle = state.clock.getElapsedTime();
        //NOTE: 乗算の値を変えるとカメラの動き(animation)がかなり変わる！同値だと円運動。異なる値だと楕円運動。
        state.camera.position.x = Math.sin(angle) * 8;
        state.camera.position.z = Math.cos(angle) * 3;
        state.camera.lookAt(0, 0, 0);
    })

    return (
        <>
            {/* <orbitControls args={[camera, gl.domElement]} /> */}

            <directionalLight intensity={ 4.5 } position={[1, 2, 3]} />
            <ambientLight intensity={1.5} />

            <group ref={ groupRef}>
                <mesh position-x={-2}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial color="orange" />
                </mesh>
                <mesh ref={ cubeRef } position-x={2} rotation-y={Math.PI * 0.23} scale={1.5}>
                {/* <sphereGeometry args={[1.5, 32, 32]} /> */}
                    <boxGeometry scale={3}/>
                {/* <meshBasicMaterial args={[{color: 'red', wireframe: true}]} /> */}
                <meshStandardMaterial color='mediumpurple' wireframe={false} />
                </mesh>
            </group>

            <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
                <planeGeometry />
                <meshStandardMaterial color="greenyellow" />
            </mesh>

            <CustomObject></CustomObject>
        </>
    );
}