import { NextPage } from 'next'
import { useState } from 'react'
import * as Colyseus from 'colyseus.js'
import { GameRoom } from '../components/GameRoom'
import Lobby from '../components/Lobby'

const colyseus =
  typeof window !== 'undefined'
    ? new Colyseus.Client(
        process.env.NODE_ENV === 'production'
          ? 'wss://web-production-b05a.up.railway.app'
          : 'ws://localhost:8080',
      )
    : null!

const Home: NextPage = () => {
  const [room, setRoom] = useState<Colyseus.Room | null>(null)

  if (room) {
    return <GameRoom room={room} onLeave={() => setRoom(null)} />
  }

  return <Lobby colyseus={colyseus} setRoom={setRoom} />
}

export default Home
