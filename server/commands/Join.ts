import { Command } from '@colyseus/command'
import { GameRoom } from '../Room'
import { Player } from '../Schema'

interface Options {
  playerId: string
  name: string
}

export class JoinCommand extends Command<GameRoom, Options> {
  validate({ playerId }: Options) {
    return !!playerId && this.state.players.length < 4
  }

  execute({ playerId, name }: { playerId: string; name: string }) {
    const player = new Player(playerId)
    player.name = name
    player.index = this.state.players.length
    this.state.players.push(player)
  }
}
