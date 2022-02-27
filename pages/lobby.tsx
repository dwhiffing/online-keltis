import { useState, useRef, useEffect, useCallback } from 'react'
import * as Colyseus from 'colyseus.js'
import { GameRoom } from '../components/GameRoom'

const colyseus =
  typeof window !== 'undefined'
    ? new Colyseus.Client('ws://localhost:8080')
    : null!

const App = () => {
  const intervalRef = useRef<ReturnType<typeof setInterval>>()
  const autoConnectAttempted = useRef(false)
  const [availableRooms, setAvailableRooms] = useState<
    Colyseus.RoomAvailable<{ roomName: string }>[]
  >([])
  const [room, setRoom] = useState<Colyseus.Room | null>(null)

  const onCreateRoom = () => {
    createRoom().then((room) => {
      if (room) setRoom(room)
    })
  }

  const onJoinRoom = useCallback(
    (roomId, name = 'Player' + Date.now()) =>
      joinRoom(roomId, name, (room) => setRoom(room)),
    [],
  )

  useEffect(() => {
    if (!colyseus) return
    const getAvailableRooms = async () => {
      const rooms = await colyseus.getAvailableRooms()
      if (room || rooms.length === 0) return

      if (!localStorage.getItem(rooms[0].roomId)) {
        onJoinRoom(rooms[0].roomId)
      }
      setAvailableRooms(rooms)
    }

    intervalRef.current = setInterval(getAvailableRooms, 500)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [room, onJoinRoom])

  useEffect(() => {
    if (!availableRooms) return
    const lastRoom = availableRooms.find((room) =>
      localStorage.getItem(room.roomId),
    )

    if (!room && lastRoom && !autoConnectAttempted.current) {
      autoConnectAttempted.current = true
      onJoinRoom(lastRoom.roomId)
    }
  }, [room, availableRooms, onJoinRoom])

  if (room) {
    return <GameRoom room={room} />
  }

  return (
    <div>
      {availableRooms.map((room) => (
        <div key={room.roomId} onClick={() => onJoinRoom(room.roomId)}>
          {room.metadata?.roomName || room.roomId}
        </div>
      ))}

      <button onClick={() => onCreateRoom()}>Create Room</button>
    </div>
  )
}

const createRoom = async () => {
  const roomName = 'asd'
  // const roomName = prompt('Room name?')
  // if (!roomName) return

  const room = await colyseus.create('game', {
    roomName,
    name: 'Player' + Date.now(),
  })
  localStorage.setItem(room.id, room.sessionId)
  return room
}

const joinRoom = async (
  roomId: string,
  name: string,
  onJoin: (room: Colyseus.Room) => void,
) => {
  try {
    const room = await joinRoomWithReconnect(roomId, name)
    if (!room) throw new Error('Failed to join room')
    localStorage.setItem(room.id, room.sessionId)
    onJoin(room)
    return room
  } catch (e) {
    alert(e)
    localStorage.removeItem(roomId)
  }
}

const joinRoomWithReconnect = async (roomId: string, name: string) => {
  let room,
    sessionId = localStorage.getItem(roomId)
  if (sessionId) {
    try {
      room = await colyseus.reconnect(roomId, sessionId)
    } catch (e) {
      console.log(e)
    }
  } else {
    room = room || (await colyseus.joinById(roomId, { name }))
  }

  return room
}

export default App
