import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(subscribeWithSelector((set) =>
  {
    return {
      blocksCount: 3,
      // Time
      startTime: 0,
      endTime: 0,

      // Phases of the game
      phase: 'ready',
      start: () => {
          console.log('Game Started')
          set((state) =>
          {
            if (state.phase === 'ready')
              return { phase: 'playing', startTime: Date.now() }

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
              return { phase: 'ended', endTime: Date.now() }

            return {}
          })
      }
    }
}))