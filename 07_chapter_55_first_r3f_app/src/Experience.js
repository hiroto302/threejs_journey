import { useFrame, extend, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

extend({ OrbitControls });

export default function Experience() {

    const { camera, gl } = useThree();

    const cubeRef = useRef();
    const groupRef = useRef();

    useFrame((state, delta) =>{
        // console.log(state);
        cubeRef.current.rotation.y += delta;
        // groupRef.current.rotation.y += delta;
    })

    return (
        <>
            <orbitControls args={[camera, gl.domElement]} />

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
        </>
    );
}