import Head from 'next/head'
import { Card, SUIT_VALUES, groupCards, State } from '../lib'

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
          <div
            key={i}
            className={`player my-8 ${i === state.playerIndex ? 'active' : ''}`}
          >
            <p>Player {i + 1}</p>

            <div>
              {Object.values(player.piles).length > 0 && <p>Piles</p>}
              <Piles key={i} piles={player.piles} />
            </div>
          </div>
        ))}

      <div className="order-last space-y-2">
        <div>
          <p>Discard</p>
          <div className="flex space-x-2 h-20">
            {groupCards(state.discards).map((pile, i) => (
              <Cards onClick={onDraw} spread={false} key={i} cards={pile} />
            ))}
          </div>
        </div>

        <div>
          <p>Hand</p>
          <Cards
            selected={selectedCard}
            onClick={onSelect}
            cards={state.players[0].hand}
          />
        </div>

        <div>
          <p>Actions</p>
          <div className="flex space-x-2 h-20">
            {state.phaseIndex === 0 ? null : (
              <button onClick={() => onDraw()}>draw</button>
            )}
            {state.phaseIndex === 1 || !selectedCard ? null : (
              <button onClick={() => onDiscard()}>discard</button>
            )}
            {state.phaseIndex === 1 || !selectedCard ? null : (
              <button onClick={() => onPlay()}>play</button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export const Cards = ({
  cards,
  onClick,
  selected,
  spread = true,
}: {
  cards: Card[]
  onClick?: (card: Card) => void
  spread?: boolean
  selected?: Card | null
}) => {
  const _cards = spread ? cards : cards.slice(cards.length - 1, cards.length)
  return (
    <div className="cards-wrapper">
      {_cards.map((card, i) => (
        <div
          key={i}
          className={`card ${selected === card ? 'selected' : ''}`}
          onClick={onClick ? () => onClick(card) : undefined}
        >
          <span>{SUIT_VALUES[card.value]}</span>
          <div className={`${SUIT_CLASSES[card.suit]}`} />
        </div>
      ))}
    </div>
  )
}

export const Piles = ({ piles }: { piles: Card[] }) => (
  <div>
    {groupCards(piles).map((pile: Card[], i) => (
      <Cards key={i} cards={pile} />
    ))}
  </div>
)

const SUIT_CLASSES = [
  'bg-suit-0',
  'bg-suit-1',
  'bg-suit-2',
  'bg-suit-3',
  'bg-suit-4',
  'bg-suit-5',
]
