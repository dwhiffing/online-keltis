import { Command } from '@colyseus/command'
import { GameRoom } from '../Room'
import { Card } from '../Schema'

export class DiscardCommand extends Command<
  GameRoom,
  { card: { suit: number; value: number } }
> {
  execute({ card }: { card: { suit: number; value: number } }) {
    this.state.discards.push(new Card(card))
    this.state.activePlayer.removeCard(new Card(card))
    this.state.nextPhase()
  }
}
