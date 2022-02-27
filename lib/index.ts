import { groupBy } from 'lodash'
import shuffle from 'lodash/shuffle'

export interface Card {
  suit: number
  value: number
}

export interface Player {
  id?: string
  name?: string
  index?: number
  connected?: boolean
  remainingConnectionTime?: number
  hand: Card[]
  piles: Card[]
  // stones: Card[]
}

export interface State {
  playerIndex: number
  phaseIndex: number
  deck: Card[]
  // stones: Card[]
  discards: Card[]
  players: Player[]
}

const SUITS = [0, 1, 2, 3, 4]
export const NUMBERS = ['one', 'two', 'three', 'four', 'five', 'six']
const SUIT_BASE = [0, 1, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 9, 10, 11, 11]
const STONES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const POINT_CARDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
export const SUIT_VALUES = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'X',
  'E',
]
const DECK: Card[] = [
  ...SUITS.map((s) => SUIT_BASE.map((v) => ({ suit: s, value: v }))).flat(),
  ...POINT_CARDS.map((v) => ({ suit: 5, value: v })),
]

export const getInitialState = (): State => {
  const initialDeck = shuffle(DECK)
  const initialStones = STONES.map((v) => ({ suit: 6, value: v }))
  const initialPlayer: Player = {
    hand: [],
    piles: [],
    // stones: [],
  }
  return {
    deck: initialDeck,
    // stones: initialStones,
    discards: [],
    players: [{ ...initialPlayer }, { ...initialPlayer }],
    playerIndex: 0,
    phaseIndex: 0,
  }
}

export const dealCards = (state: State) => {
  let deck = state.deck
  const players = state.players.map((p) => {
    const hand = deck.slice(0, 8)
    deck = deck.slice(8)
    return { ...p, hand }
  })
  return { ...state, deck, players }
}

export const drawCard = (state: State, drawnCard?: Card) => {
  let deck = state.deck
  let discards = state.discards
  const phaseIndex = 0
  const players = state.players.map((p, i) => {
    if (i !== state.playerIndex) return p
    let card
    if (drawnCard) {
      card = drawnCard
      discards = discards.filter((c) => c !== drawnCard)
    } else {
      card = deck[0]
      deck = deck.slice(1)
    }
    return { ...p, hand: [...p.hand, card] }
  })

  const playerIndex = (state.playerIndex + 1) % state.players.length
  return { ...state, deck, players, discards, playerIndex, phaseIndex }
}

export const discardCard = (state: State, selectedCard: Card) => {
  const discards = [...state.discards, selectedCard]
  const players = state.players.map((p, i) => {
    if (i !== state.playerIndex) return p
    return { ...p, hand: p.hand.filter((c) => c !== selectedCard) }
  })
  return { ...state, players, discards, phaseIndex: 1 }
}

export const playCard = (state: State, selectedCard: Card) => {
  const players = state.players.map((p, i) => {
    if (i !== state.playerIndex) return p

    const piles = [...p.piles, selectedCard]
    return { ...p, piles, hand: p.hand.filter((c) => c !== selectedCard) }
  })
  return { ...state, players, phaseIndex: 1 }
}

export const groupCards = (cards: Card[]) =>
  Object.values(groupBy(cards, (c) => c.suit))

let i = 0
export const getName = () => {
  return names[i++]
}

const names = shuffle([
  'Dayne',
  'Golden',
  'Chelsie',
  'Elody',
  'Corene',
  'Katrine',
  'Gregoria',
  'Chelsey',
  'Camille',
  'Bernardo',
  'Kristin',
  'Ned',
  'Oleta',
  'Bernice',
  'Melany',
  'Nelle',
  'Hardy',
  'Myron',
  'Jacey',
  'Gilberto',
  'Pattie',
  'Lawrence',
  'Alda',
  'Jayme',
  'Mable',
  'Jerad',
  'Kamron',
  'Javonte',
  'Lucie',
  'Robin',
  'Wilber',
  'Dameon',
  'Sigmund',
  'Hayley',
  'Ladarius',
  'Lincoln',
  'Wilford',
  'Melvin',
  'Buddy',
  'Omari',
  'Lafayette',
  'Matilda',
  'Federico',
  'Fausto',
  'Dexter',
  'Boyd',
  'Kim',
  'Lance',
  'Art',
  'Kathryn',
])
