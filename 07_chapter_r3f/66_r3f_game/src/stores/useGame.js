import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(subscribeWithSelector((set) =>
  {
    return {
      blocksCount: 3,

      // Phases of the game
      phase: 'ready',
      start: () => {
          console.log('Game Started')
          set((state) =>
          {
            if (state.phase === 'ready')
              return { phase: 'playing' }

            return {}
          })
      },
      restart: () => {
          console.log('Game Restarted')
          set((state) =>
          {
            if( state.phase ==='playing' || state.phase === 'ended')
              return { phase: 'ready' }

            return {}
          })
      },
      end: () => {
          console.log('Game Ended')
          set((state) =>
          {
            if( state.phase ==='playing')
              return { phase: 'ended' }

            return {}
          })
      }
    }
}))