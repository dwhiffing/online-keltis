import { Command } from '@colyseus/command'
import { GameRoom } from '../Room'

export class LeaveCommand extends Command<GameRoom, { playerId: string }> {
  execute({ playerId }: { playerId: string }) {
    this.state.players = this.state.players.filter((p) => p.id !== playerId)
  }
}
