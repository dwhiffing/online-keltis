import { Command } from '@colyseus/command'
import { GameRoom } from '../Room'
import { Card } from '../Schema'

interface Options {
  playerId: string
  card: { suit: number; value: number }
}

export class PlayCommand extends Command<GameRoom, Options> {
  validate({ playerId }: Options) {
    return playerId === this.state.activePlayer.id
  }
  execute({ card }: Options) {
    this.state.activePlayer.piles.push(new Card(card))
    this.state.activePlayer.removeCard(new Card(card))
    this.state.nextPhase()
  }
}
