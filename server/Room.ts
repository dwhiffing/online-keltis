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
    if (this.state.playerIndex !== -1)
      throw new ServerError(400, 'Game in progress')

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
      return
    }

    const player = this.state.players.find((p) => p.id === playerId)!
    player.connected = false
    const reconnection = this.allowReconnection(client)

    player.reconnection = reconnection
    player.remainingConnectionTime = 5
    try {
      player.leaveInterval = this.clock.setInterval(() => {
        if (player.remainingConnectionTime > 0)
          player.remainingConnectionTime -= 1

        if (player.remainingConnectionTime === 0) {
          player.leaveInterval && player.leaveInterval.clear()
          reconnection.reject()
        }
      }, 1000)

      await reconnection
      player.leaveInterval && player.leaveInterval.clear()
      player.connected = true
    } catch (e) {
      this.dispatcher.dispatch(new Commands.LeaveCommand(), { playerId })
      if (this.state.players.length < 2) {
        this.disconnect()
      }
    }
  }
}
