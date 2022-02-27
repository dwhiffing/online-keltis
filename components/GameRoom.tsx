import { useEffect, useState } from 'react'
import * as Colyseus from 'colyseus.js'
import { Card, State } from '../lib'
import { Layout } from './Layout'

export const GameRoom = ({ room }: { room: Colyseus.Room }) => {
  const [state, setState] = useState<State | null>(null)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)

  useEffect(() => {
    room.onStateChange((state) => {
      setState(state.toJSON())
    })
  }, [room])

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
      <div>
        {state.players.map((player) => (
          <p key={player.name}>{player.name}</p>
        ))}
        <button onClick={() => room.send('Start')}>start</button>
      </div>
    )
  }

  return (
    <Layout
      state={state}
      selectedCard={selectedCard}
      onSelect={onSelect}
      onDiscard={onDiscard}
      onDraw={onDraw}
      onPlay={onPlay}
    />
  )
}
