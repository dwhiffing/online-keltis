import { useEffect, useState } from 'react'
import * as lib from '../lib'
import { State, Card } from '../lib'
import { Layout } from './Layout'

const initialState = lib.getInitialState()

const LocalRoom = () => {
  const [state, setState] = useState<State>(initialState)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)

  useEffect(() => {
    setState(lib.dealCards)
  }, [])

  const onSelect = (card: Card) => {
    if (state.phaseIndex === 1) return
    setSelectedCard(selectedCard === card ? null : card)
  }

  const onPlay = () => {
    if (state.phaseIndex === 1 || !selectedCard) return
    setSelectedCard(null)
    setState((state) => lib.playCard(state, selectedCard))
  }

  const onDraw = (card?: Card) => {
    if (state.phaseIndex === 0) return
    setState((state) => lib.drawCard(state, card))
  }

  const onDiscard = () => {
    if (state.phaseIndex === 1 || !selectedCard) return
    setSelectedCard(null)
    setState((state) => lib.discardCard(state, selectedCard))
  }

  return (
    <Layout
      state={state}
      onSelect={onSelect}
      selectedCard={selectedCard}
      onDiscard={onDiscard}
      onDraw={onDraw}
      onPlay={onPlay}
    />
  )
}

export default LocalRoom
