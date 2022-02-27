import { Dispatcher } from '@colyseus/command'
import { Room, Client, ServerError } from 'colyseus'
import { RoomState } from './Schema'
import * as Commands from './commands'

export class GameRoom extends Room<RoomState> {
  maxClients = 4
  dispatcher = new Dispatcher(this)

  onCreate({ roomName = 'Keltis' } = {}) {
    this.setState(new RoomState())
    this.setMetadata({ roomName })

    this.onMessage('*', (client, action, _data = {}) => {
      // @ts-ignore
      const Command = Commands[action + 'Command']
      if (Command) {
        this.dispatcher.dispatch(new Command(), {
          ..._data,
          broadcast: this.broadcast.bind(this),
          playerId: _data.playerId || client.sessionId,
        })
      }
    })
  }

  onAuth() {
    if (this.state.players.length >= 4)
      throw new ServerError(400, 'Too many players')

    return true
  }

  onJoin(client: Client, options: { name: string; roomName: string }) {
    const playerId = client.sessionId
    this.dispatcher.dispatch(new Commands.JoinCommand(), {
      playerId,
      ...options,
    })
    this.broadcast('message', playerId + ' joined')
  }

  onLeave = async (client: Client, consented: boolean) => {
    const playerId = client.sessionId
    if (consented) {
      this.dispatcher.dispatch(new Commands.LeaveCommand(), { playerId })
    } else {
      const reconnection = this.allowReconnection(client)
      this.dispatcher.dispatch(new Commands.DisconnectCommand(), {
        playerId,
        reconnection,
      })
    }
  }
}
