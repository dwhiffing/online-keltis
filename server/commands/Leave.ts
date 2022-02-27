import { Command } from '@colyseus/command'
import { GameRoom } from '../Room'

interface Options {
  playerId: string
}
export class LeaveCommand extends Command<GameRoom, Options> {
  execute({ playerId }: Options) {
    this.state.players = this.state.players.filter((p) => p.id !== playerId)
  }
}
