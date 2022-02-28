import { type, ArraySchema, Schema } from '@colyseus/schema'
import { Delayed } from 'colyseus'
import * as lib from '../lib'

export class Card extends Schema {
  @type('number')
  suit = 0

  @type('number')
  value = 0

  constructor(card: { suit: number; value: number }) {
    super()
    this.suit = card.suit
    this.value = card.value
  }
}

export class Pile extends Schema {
  @type([Card])
  cards = new ArraySchema<Card>()
  constructor(cards: Card[] = []) {
    super()
    this.cards = new ArraySchema(...cards)
  }
  addCard(card: Card) {
    this.cards.push(card)
  }
}

export class Player extends Schema {
  reconnection: any
  leaveInterval: Delayed | null

  @type('string')
  id = ''

  @type('string')
  name = ''

  @type('number')
  index = 0

  @type('boolean')
  connected = true

  @type('number')
  remainingConnectionTime = 0

  @type([Card])
  hand = new ArraySchema<Card>()

  @type([Card])
  piles = new ArraySchema<Card>()

  constructor(id: string) {
    super()
    this.id = id
    this.leaveInterval = null
  }

  addCard = (card: Card) => {
    this.hand.push(card)
  }

  removeCard = (card: Card) => {
    const _card = this.hand.find(
      (c) => c.suit === card.suit && c.value === card.value,
    )
    this.hand = this.hand.filter((c) => c !== _card)
  }
}

export class RoomState extends Schema {
  @type([Player])
  players = new ArraySchema<Player>()

  @type([Card])
  deck = new ArraySchema<Card>()

  @type([Card])
  discards = new ArraySchema<Card>()

  @type('number')
  playerIndex = -1

  @type('number')
  phaseIndex = 0

  shuffle() {
    const initialState = lib.getInitialState()
    this.deck.push(...initialState.deck.map((c) => new Card(c)))
  }

  drawFromDeck() {
    return this.deck.pop()
  }

  drawFromDiscard(card: Card) {
    this.removeCard(card)
    return card
  }

  removeCard = (card: Card) => {
    const _card = this.discards.find(
      (c) => c.suit === card.suit && c.value === card.value,
    )
    this.discards = this.discards.filter((c) => c !== _card)
  }

  nextPhase = () => {
    if (this.phaseIndex === 0) {
      this.phaseIndex = 1
    } else {
      this.phaseIndex = 0
      this.playerIndex = (this.playerIndex + 1) % this.players.length
    }
  }

  get activePlayer() {
    return this.players[this.playerIndex]
  }
}
