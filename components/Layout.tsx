import Head from 'next/head'
import { Card, State } from '../lib'
import { PlayerCard, Actions } from './index'

export const Layout = ({
  state,
  onSelect,
  selectedCard,
  onDiscard,
  onDraw,
  onPlay,
}: {
  state: State | null
  selectedCard: Card | null
  onSelect: (card: Card) => void
  onDiscard: () => void
  onDraw: () => void
  onPlay: () => void
}) => {
  if (!state) return null
  return (
    <main>
      <Head>
        <title>Card game</title>
        <meta name="description" content="Card game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {state.players
        .map((p, i) => ({ ...p, index: i }))
        .map((player, i) => (
          <PlayerCard
            onSelect={onSelect}
            selectedCard={selectedCard}
            key={i}
            index={i}
            player={player}
            playerIndex={state.playerIndex}
          />
        ))}

      <Actions
        discards={state.discards}
        onDraw={state.phaseIndex === 0 ? undefined : onDraw}
        onDiscard={
          state.phaseIndex === 1 || !selectedCard ? undefined : onDiscard
        }
        onPlay={state.phaseIndex === 1 || !selectedCard ? undefined : onPlay}
      />
    </main>
  )
}
