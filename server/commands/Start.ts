import { Command } from '@colyseus/command'
import { GameRoom } from '../Room'

interface Options {
  playerId: string
}

export class StartCommand extends Command<GameRoom, Options> {
  validate() {
    return this.state.players.length > 1 && this.state.playerIndex === -1
  }
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
