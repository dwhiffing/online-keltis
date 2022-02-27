import { Command } from '@colyseus/command'
import { GameRoom } from '../Room'
import { Card } from '../Schema'

export class PlayCommand extends Command<
  GameRoom,
  { card: { suit: number; value: number } }
> {
  execute({ card }: { card: { suit: number; value: number } }) {
    this.state.activePlayer.piles.push(new Card(card))
    this.state.activePlayer.removeCard(new Card(card))
    this.state.nextPhase()
  }
}
