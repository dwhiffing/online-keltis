import { Command } from '@colyseus/command'
import { GameRoom } from '../Room'
import { Card } from '../Schema'

interface Options {
  playerId?: String
  card: { suit: number; value: number }
}
export class DiscardCommand extends Command<GameRoom, Options> {
  validate({ playerId }: Options) {
    return playerId === this.state.activePlayer.id
  }

  execute({ card }: Options) {
    this.state.discards.push(new Card(card))
    this.state.activePlayer.removeCard(new Card(card))
    this.state.nextPhase()
  }
}
