import { OrbitControls } from '@react-three/drei'
import Cube from './Cube.js'
import { useControls } from 'leva'


export default function Experience()
{
    const { x, y } = useControls({
        x: {
            value: -2,
            min: -5,
            max: 5,
            step: 0.01,
        },
        y: {
            value: 0,
            min: -5,
            max: 5,
            step: 0.01,
        }
    })

    const { position, color, visible } = useControls({
        position: {
            value: { x: 2, y: 0},
            step: 0.01,
            joystick: 'invertY',
        },
        color: '#ff0000',
        visible: true,
    })
    // console.log(controls)


    return <>

        <OrbitControls makeDefault />

        <directionalLight position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
        <ambientLight intensity={ 1.5 } />

        <mesh position-x={ x } position-y={ y } >
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>

        <mesh position={ [position.x, position.y, 0] } scale={ 1.5 } visible={ visible }>
            <boxGeometry />
            <meshStandardMaterial color={ color } />
        </mesh>

        {/* <Cube scale={ 2 }/> */}

        <mesh position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

    </>
}