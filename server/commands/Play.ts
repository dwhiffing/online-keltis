import { Command } from '@colyseus/command'
import { uniq } from 'lodash'
import { GameRoom } from '../Room'
import { Card } from '../Schema'

interface Options {
  playerId: string
  card: { suit: number; value: number }
}

export class PlayCommand extends Command<GameRoom, Options> {
  validate({ playerId, card }: Options) {
    if (playerId !== this.state.activePlayer.id) return false

    // TODO: need to look at first two cards to determine direction of stack
    const player = this.state.players.find((p) => p.id === playerId)!
    const suitStack = player.piles.filter((c) => c.suit === card.suit).reverse()
    let direction = 0
    const unique: Card[] = uniq(suitStack)
    if (unique.length > 1) {
      direction = unique[0].value > unique[1].value ? -1 : 1
    }
    const top = suitStack[suitStack.length - 1]
    console.log(direction, unique)
    if (top && (direction ? top.value < card.value : top.value > card.value))
      return false

    return true
  }
  execute({ card }: Options) {
    this.state.activePlayer.piles.push(new Card(card))
    this.state.activePlayer.removeCard(new Card(card))
    this.state.nextPhase()
  }
}
