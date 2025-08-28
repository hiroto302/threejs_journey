import { OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'

import Lights from './Lights.jsx'
import { Level, BlockSpinner } from './Level.js'
import Player from './Player.js'

import useGame from './stores/useGame.js'

export default function Experience()
{
    const blocksCount = useGame((state) => state.blocksCount)


    return <>
        <OrbitControls makeDefault />
        <Physics debug={ false } >
            <Lights />
            <Level count={ blocksCount } />
            <Player />
        </Physics>
    </>
}