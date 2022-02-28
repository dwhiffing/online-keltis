import { useEffect, useState } from 'react'
import * as Colyseus from 'colyseus.js'
import { Card, State } from '../lib'
import { Layout } from './Layout'

export const GameRoom = ({
  room,
  onLeave,
}: {
  room: Colyseus.Room
  onLeave: () => void
}) => {
  const [state, setState] = useState<State | null>(null)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)

  useEffect(() => {
    room.onStateChange((state) => {
      setState(state.toJSON())
    })
    room.onLeave((code) => {
      console.warn({ type: 'leave', code })
      onLeave()
    })
    room.onError((code, error) => {
      console.error({ type: 'error', code, error })
      onLeave()
    })
  }, [room, onLeave])

  const onSelect = (card: Card) => {
    if (!state || state.phaseIndex === 1) return
    setSelectedCard(selectedCard === card ? null : card)
  }

  const onDraw = (drawnCard?: Card) => {
    if (!state || state.phaseIndex === 0) return
    room.send('Draw', { drawnCard })
  }

  const onDiscard = () => {
    if (!state || state.phaseIndex === 1 || !selectedCard) return
    setSelectedCard(null)
    room.send('Discard', { card: selectedCard })
  }

  const onPlay = () => {
    if (!state || state.phaseIndex === 1 || !selectedCard) return
    setSelectedCard(null)
    room.send('Play', { card: selectedCard })
  }

  if (state?.playerIndex === -1) {
    return (
      <main>
        <div className="space-y-6">
          <div className="space-y-2">
            {state.players.map((player) => (
              <div key={player.name} className="border rounded-md p-3">
                <p>{player.name}</p>
              </div>
            ))}
          </div>
          <button
            disabled={state.players.length < 2}
            onClick={() => room.send('Start')}
          >
            Start Game
          </button>
        </div>
      </main>
    )
  }

  return (
    <Layout
      state={state}
      currentPlayerId={room.sessionId}
      selectedCard={selectedCard}
      onSelect={onSelect}
      onDiscard={onDiscard}
      onDraw={onDraw}
      onPlay={onPlay}
    />
  )
}
