import { Wireframe } from "three/examples/jsm/Addons.js";

export default function Experience() {
    return (
        <>
            {/* <mesh >
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial color="red" />
            </mesh> */}
            {/* <mesh>
                <torusGeometry />
                <meshNormalMaterial />
            </mesh> */}
            <mesh position-x={1} rotation-y={Math.PI * 0.23} scale={1.5}>
              {/* <sphereGeometry args={[1.5, 32, 32]} /> */}
              <boxGeometry />
              {/* <meshBasicMaterial args={[{color: 'red', wireframe: true}]} /> */}
              <meshBasicMaterial color='red' wireframe={true} />
            </mesh>
        </>
    );
}