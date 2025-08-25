import { OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'

import Lights from './Lights.jsx'
import { Level, BlockSpinner } from './Level.js'

export default function Experience()
{
    return <>
        <OrbitControls makeDefault />
        <Physics debug >
            <Lights />
            <Level count={3} />
        </Physics>
    </>
}