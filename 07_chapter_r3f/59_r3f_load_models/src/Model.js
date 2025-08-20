import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { useGLTF, Clone } from '@react-three/drei'
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
  return <>
      <Clone object={ model.scene } scale={ 0.35 } position-x={ -4 }/>
      <Clone object={ model.scene } scale={ 0.35 } position-x={ 0 }/>
      <Clone object={ model.scene } scale={ 0.35 } position-x={ 4 }/>
  </>
}

useGLTF.preload('/hamburger.glb')