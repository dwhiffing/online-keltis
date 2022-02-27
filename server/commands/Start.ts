import { Command } from '@colyseus/command'
import { GameRoom } from '../Room'

export class StartCommand extends Command<GameRoom> {
  execute() {
    this.state.playerIndex = 0
    this.state.shuffle()
    this.state.players.forEach((player) => {
      for (let i = 0; i < 8; i++) {
        player.addCard(this.state.drawFromDeck()!)
      }
    })
  }
}
