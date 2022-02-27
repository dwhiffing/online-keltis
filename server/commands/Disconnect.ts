import { Command } from '@colyseus/command'
import { GameRoom } from '../Room'

export class DisconnectCommand extends Command<GameRoom> {
  validate({
    playerId,
    reconnection,
  }: {
    playerId: string
    reconnection: boolean
  }) {
    return !!this.state.players.find((p) => p.id === playerId) && reconnection
  }

  execute({
    playerId,
    reconnection,
  }: {
    playerId: string
    reconnection: unknown
  }) {
    const player = this.state.players.find((p) => p.id === playerId)!

    player.remainingConnectionTime = 120
    player.connected = false
    player.reconnection = reconnection

    player.reconnection.then(() => {
      player.connected = true
    })
  }
}
