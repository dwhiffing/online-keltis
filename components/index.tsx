import { Card, Player, SUIT_VALUES, groupCards } from '../lib'

export const Piles = ({ piles }: { piles: Card[] }) => (
  <div>
    {groupCards(piles).map((pile: Card[], i) => (
      <Cards key={i} cards={pile} />
    ))}
  </div>
)

export const Actions = ({
  discards,
  onDraw,
  onDiscard,
  onPlay,
}: {
  discards: Card[]
  onDraw?: () => void
  onDiscard?: () => void
  onPlay?: () => void
}) => (
  <div className="order-last">
    <p>Discard</p>
    <div className="flex space-x-2 mb-2 h-20">
      {groupCards(discards).map((pile, i) => (
        <Cards onClick={onDraw} spread={false} key={i} cards={pile} />
      ))}
    </div>
    <div className="flex space-x-2 h-20">
      {onDraw && <button onClick={() => onDraw()}>draw</button>}
      {onDiscard && <button onClick={() => onDiscard()}>discard</button>}
      {onPlay && <button onClick={() => onPlay()}>play</button>}
    </div>
  </div>
)

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
          key={`${i}`}
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
export const PlayerCard = ({
  player,
  index,
  playerIndex,
  selectedCard,
  onSelect,
}: {
  player: Player
  index: number
  playerIndex: number
  selectedCard: Card | null
  onSelect: (card: Card) => void
}) => (
  <div className={`player my-8 ${index === playerIndex ? 'active' : ''}`}>
    <p>Player {index + 1}</p>
    {Object.values(player.piles).length > 0 && <p>Piles</p>}
    <Piles key={index} piles={player.piles} />
    {index === playerIndex && (
      <>
        <p>Hand</p>
        <Cards selected={selectedCard} onClick={onSelect} cards={player.hand} />
      </>
    )}
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
