import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { useGLTF } from '@react-three/drei'
import { use } from 'react'

export default function Model()
{
  // const model = useLoader(
  //         GLTFLoader,
  //         '/hamburger.glb',
  //         // '/hamburger-draco.glb',
  //         // './FlightHelmet/glTF/FlightHelmet.gltf',

  //         (loader) =>
  //         {
  //             const dracoLoader = new DRACOLoader()
  //             dracoLoader.setDecoderPath('/draco/')
  //             loader.setDRACOLoader(dracoLoader)
  //         }
  //     )

  // // For hamburger model
  // return <primitive object={ model.scene } scale={ 0.35 } />
  // // For FlightHelmet model
  // // return <primitive object={ model.scene } scale={ 5 } position-y={-1} />

  //NOTE: Using useGLTF from @react-three/drei for better performance
  const model = useGLTF('/hamburger.glb')
  return <primitive object={ model.scene } scale={ 0.35 } />
}

useGLTF.preload('/hamburger.glb')