import { Command } from '@colyseus/command'
import { GameRoom } from '../Room'

interface Options {
  playerId: string
  reconnection: boolean
}
export class DisconnectCommand extends Command<GameRoom> {
  validate({ playerId, reconnection }: Options) {
    return !!this.state.players.find((p) => p.id === playerId) && reconnection
  }

  execute({ playerId, reconnection }: Options) {
    const player = this.state.players.find((p) => p.id === playerId)!

    player.remainingConnectionTime = 120
    player.connected = false
    player.reconnection = reconnection

    player.reconnection.then(() => {
      player.connected = true
    })
  }
}
