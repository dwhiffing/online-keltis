import { Command } from '@colyseus/command'
import { GameRoom } from '../Room'
import { Card } from '../Schema'

export class DrawCommand extends Command<
  GameRoom,
  { drawnCard: { suit: number; value: number } }
> {
  execute({ drawnCard }: { drawnCard: { suit: number; value: number } }) {
    if (drawnCard) {
      const card = this.state.drawFromDiscard(new Card(drawnCard))
      this.state.activePlayer.addCard(card)
    } else {
      const card = this.state.drawFromDeck()
      if (card) this.state.activePlayer.addCard(card)
    }
    this.state.nextPhase()
  }
}
