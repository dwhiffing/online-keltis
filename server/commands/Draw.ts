import { Command } from '@colyseus/command'
import { GameRoom } from '../Room'
import { Card } from '../Schema'
interface Options {
  playerId: string
  drawnCard: { suit: number; value: number }
}
export class DrawCommand extends Command<GameRoom, Options> {
  validate({ playerId }: Options) {
    return playerId === this.state.activePlayer.id
  }
  execute({ drawnCard }: Options) {
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
