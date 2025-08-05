import * as THREE from 'three'
import { DoubleSide } from 'three'
import { useMemo, useRef, useEffect } from 'react'

export default function CustomObject() {

  const geometryRef = useRef()

  const verticesCont = 10 * 3

  const positions = useMemo(() => {
    const positions = new Float32Array(verticesCont * 3)

    for (let i = 0; i < verticesCont * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 3
    }
    return positions
  },[])

  useEffect(() => {
      geometryRef.current.computeVertexNormals()
  }, [])

  return <mesh>
    <bufferGeometry ref={geometryRef}>
      <bufferAttribute
        attach="attributes-position"
        count={verticesCont}
        itemSize={3}
        array={positions}
      />
    </bufferGeometry>

    {/* <meshStandardMaterial color="red" side={ THREE.DoubleSide } /> */}
    <meshStandardMaterial color="red" side={ DoubleSide } />
  </mesh>
}