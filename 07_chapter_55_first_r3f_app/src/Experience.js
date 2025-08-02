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
            <mesh>
              <sphereGeometry />
              <meshBasicMaterial color="blue" />
            </mesh>
        </>
    );
}