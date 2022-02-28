import Head from 'next/head'
import { Card, SUIT_VALUES, groupCards, State } from '../lib'

export const Layout = ({
  state,
  onSelect,
  currentPlayerId,
  selectedCard,
  onDiscard,
  onDraw,
  onPlay,
}: {
  state: State | null
  currentPlayerId?: string
  selectedCard: Card | null
  onSelect: (card: Card) => void
  onDiscard: () => void
  onDraw: () => void
  onPlay: () => void
}) => {
  const index = state?.players.findIndex((p) => p.id === currentPlayerId)!
  const currentPlayer = state?.players[index]
  const isOurTurn = state?.playerIndex === index
  const activePlayer = state?.players[state?.playerIndex]

  console.log({ state, currentPlayer, activePlayer })
  if (!state || !currentPlayer || !activePlayer) return null

  let message = isOurTurn ? (
    <span className="font-bold text-xl">It&apos;s your turn</span>
  ) : (
    <span className={activePlayer.connected ? '' : 'font-bold text-xl'}>
      {activePlayer.name} is{' '}
      {activePlayer.connected
        ? 'thinking'
        : `missing (${activePlayer.remainingConnectionTime})`}
    </span>
  )

  return (
    <main>
      <Head>
        <title>Card game</title>
        <meta name="description" content="Card game" />
        <link
          rel="icon"
          href={
            process.env.NODE_ENV === 'production'
              ? '/online-keltis/favicon.ico'
              : '/favicon.ico'
          }
        />
      </Head>

      <div className="game-wrapper">
        {state.players
          .map((p, i) => ({ ...p, index: i }))
          .filter((p) => p.id !== currentPlayerId)
          .map(
            (player, i) =>
              player.piles.length > 0 && (
                <div
                  key={i}
                  className={`player my-2 ${
                    i === state.playerIndex ? 'active' : ''
                  }`}
                >
                  <p>{player.name}&apos;s piles</p>
                  <Piles key={i} piles={player.piles} />
                </div>
              ),
          )}

        <div className="order-last space-y-6">
          {currentPlayer.piles.length > 0 && (
            <div>
              <p>Your piles</p>
              <div>
                <Piles piles={currentPlayer.piles} />
              </div>
            </div>
          )}

          {state.discards.length > 0 && (
            <div>
              <p>Discard</p>
              <div className="flex space-x-2">
                {groupCards(state.discards).map((pile, i) => (
                  <Cards onClick={onDraw} spread={false} key={i} cards={pile} />
                ))}
              </div>
            </div>
          )}

          <p>{message}</p>

          <div className="space-y-2">
            <p>Your Hand ({currentPlayer.name})</p>

            <Cards
              selected={selectedCard}
              onClick={isOurTurn ? onSelect : undefined}
              cards={currentPlayer.hand.sort(sortCards)}
            />

            <div className="flex space-x-2">
              <button
                disabled={!isOurTurn || state.phaseIndex === 0}
                onClick={() => onDraw()}
              >
                draw
              </button>
              <button
                disabled={!isOurTurn || state.phaseIndex === 1 || !selectedCard}
                onClick={() => onDiscard()}
              >
                discard
              </button>

              <button
                disabled={!isOurTurn || state.phaseIndex === 1 || !selectedCard}
                onClick={() => onPlay()}
              >
                play
              </button>
            </div>
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
          className={`card ${selected === card ? 'selected' : ''} ${
            onClick ? 'cursor-pointer' : ''
          }`}
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
  <div className="space-y-1">
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

const sortCards = (a: Card, b: Card) =>
  a.suit * 10 + a.value - (b.suit * 10 + b.value)
