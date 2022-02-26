import type { NextPage } from 'next'
import Head from 'next/head'
import shuffle from 'lodash/shuffle'
import { useEffect, useState } from 'react'

interface Card {
  suit: number
  value: number
}

interface Player {
  hand: Card[]
  piles: Card[][]
  stones: Card[]
}

const SUIT_BASE = [0, 1, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 9, 10, 11, 11]
const STONES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const POINT_CARDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const SUIT_VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'X', 'E']
const SUIT_CLASSES = [
  'bg-suit-0',
  'bg-suit-1',
  'bg-suit-2',
  'bg-suit-3',
  'bg-suit-4',
  'bg-suit-5',
]
const SUITS = [0, 1, 2, 3, 4]
const DECK: Card[] = [
  ...SUITS.map((s) => SUIT_BASE.map((v) => ({ suit: s, value: v }))).flat(),
  ...POINT_CARDS.map((v) => ({ suit: 5, value: v })),
]

interface State {
  deck: Card[]
  stones: Card[]
  discards: Card[][]
  players: Player[]
}

const initialDeck = shuffle(DECK)
const initialStones = STONES.map((v) => ({ suit: 6, value: v }))
const initialPlayer: Player = {
  hand: [],
  piles: [],
  stones: [],
}
const initialState = {
  deck: initialDeck,
  stones: initialStones,
  discards: [],
  players: [{ ...initialPlayer }, { ...initialPlayer }],
}

const Home: NextPage = () => {
  const [state, setState] = useState<State>(initialState)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [playerIndex, setPlayerIndex] = useState<number>(0)
  const [phaseIndex, setPhaseIndex] = useState<number>(0)

  useEffect(() => {
    setState((state) => {
      let deck = state.deck
      const players = state.players.map((p) => {
        const hand = deck.slice(0, 8)
        deck = deck.slice(8)
        return { ...p, hand }
      })
      return { ...state, deck, players }
    })
  }, [])

  const onSelect = (card: Card) => {
    if (phaseIndex === 1) return
    setSelectedCard(selectedCard === card ? null : card)
  }

  const onDraw = (drawnCard?: Card) => {
    if (phaseIndex === 0) return
    setPlayerIndex((playerIndex + 1) % state.players.length)
    setPhaseIndex(0)
    setState((state) => {
      let deck = state.deck
      let discards = state.discards
      const players = state.players.map((p, i) => {
        if (i !== playerIndex) return p
        let card
        if (drawnCard) {
          card = drawnCard
          discards = discards.map((pile) => pile.filter((c) => c !== drawnCard))
        } else {
          card = deck[0]
          deck = deck.slice(1)
        }
        return { ...p, hand: [...p.hand, card] }
      })
      return { ...state, deck, players, discards }
    })
  }

  const onDiscard = () => {
    if (phaseIndex === 1 || !selectedCard) return
    setPhaseIndex(1)
    setSelectedCard(null)

    setState((state) => {
      let discards = state.discards
      const suit = selectedCard?.suit
      const index = discards.findIndex((d) => d.some((c) => c.suit === suit))
      if (index === -1) {
        discards = [...discards, [selectedCard]]
      } else {
        discards = discards.map((pile, i) =>
          i === index ? [...pile, selectedCard] : pile,
        )
      }

      const players = state.players.map((p, i) => {
        if (i !== playerIndex) return p
        return { ...p, hand: p.hand.filter((c) => c !== selectedCard) }
      })
      return { ...state, players, discards }
    })
  }

  const onPlay = () => {
    if (phaseIndex === 1 || !selectedCard) return
    setPhaseIndex(1)
    setSelectedCard(null)
    setState((state) => {
      const players = state.players.map((p, i) => {
        if (i !== playerIndex) return p

        let piles = p.piles
        const suit = selectedCard?.suit
        const index = piles.findIndex((d) => d.some((c) => c.suit === suit))
        if (index === -1) {
          piles = [...piles, [selectedCard]]
        } else {
          piles = piles.map((pile, i) =>
            i === index ? [...pile, selectedCard] : pile,
          )
        }
        return { ...p, piles, hand: p.hand.filter((c) => c !== selectedCard) }
      })
      return { ...state, players }
    })
  }

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
            className={`player my-8 ${i === playerIndex ? 'active' : ''}`}
            key={i}
          >
            <p>Player {i + 1}</p>
            {player.piles.length > 0 && <p>Piles</p>}
            <Piles key={i} piles={player.piles} />
            {i === playerIndex && (
              <>
                <p>Hand</p>
                <Cards
                  selected={selectedCard}
                  onClick={onSelect}
                  cards={player.hand}
                />
              </>
            )}
          </div>
        ))}

      <Actions
        discards={state.discards}
        onDraw={phaseIndex === 0 ? undefined : onDraw}
        onDiscard={phaseIndex === 1 || !selectedCard ? undefined : onDiscard}
        onPlay={phaseIndex === 1 || !selectedCard ? undefined : onPlay}
      />
    </main>
  )
}

const Piles = ({ piles }: { piles: Card[][] }) => {
  return (
    <div>
      {piles.map((pile: Card[], i) => (
        <Cards key={i} cards={pile} />
      ))}
    </div>
  )
}

const Actions = ({
  discards,
  onDraw,
  onDiscard,
  onPlay,
}: {
  discards: Card[][]

  onDraw?: () => void
  onDiscard?: () => void
  onPlay?: () => void
}) => (
  <div className="order-last">
    <p>Discard</p>
    <div className="flex space-x-2 mb-2 h-20">
      {discards.map((pile, i) => (
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

const Cards = ({
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

export default Home
