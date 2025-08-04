import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export default function Experience() {

    const cubeRef = useRef();
    const groupRef = useRef();

    useFrame((state, delta) =>{
        cubeRef.current.rotation.y += delta;
        groupRef.current.rotation.y += delta;
    })

    return (
        <>
            {/* <mesh >
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial color="red" />s
            </mesh> */}
            {/* <mesh>
                <torusGeometry />
                <meshNormalMaterial />
            </mesh> */}
            <group ref={ groupRef}>
                <mesh position-x={-2}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshBasicMaterial color="orange" />
                </mesh>
                <mesh ref={ cubeRef } position-x={2} rotation-y={Math.PI * 0.23} scale={1.5}>
                {/* <sphereGeometry args={[1.5, 32, 32]} /> */}
                    <boxGeometry scale={3}/>
                {/* <meshBasicMaterial args={[{color: 'red', wireframe: true}]} /> */}
                <meshBasicMaterial color='mediumpurple' wireframe={false} />
                </mesh>
            </group>
            <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
                <planeGeometry />
                <meshBasicMaterial color="greenyellow" />
            </mesh>
        </>
    );
}