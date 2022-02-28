import { useState, useRef, useEffect, useCallback } from 'react'
import * as Colyseus from 'colyseus.js'
import { getName } from '../lib'

const Lobby = ({
  colyseus,
  setRoom,
}: {
  colyseus: Colyseus.Client
  setRoom: (room: Colyseus.Room) => void
}) => {
  const intervalRef = useRef<ReturnType<typeof setInterval>>()
  const autoConnectAttempted = useRef(false)
  const [availableRooms, setAvailableRooms] = useState<
    Colyseus.RoomAvailable<{ roomName: string }>[]
  >([])

  const createRoom = useCallback(async () => {
    const roomName = 'Game' + Date.now()
    // const roomName = prompt('Room name?')
    // if (!roomName) return

    const room = await colyseus.create('game', { roomName, name: getName() })
    localStorage.setItem(room.id, room.sessionId)
    return room
  }, [colyseus])

  const joinRoomWithReconnect = useCallback(
    async (roomId: string, name: string) => {
      let room,
        sessionId = localStorage.getItem(roomId)
      if (sessionId) {
        try {
          room = await colyseus.reconnect(roomId, sessionId)
        } catch (e) {
          console.error(e)
        }
      } else {
        room = room || (await colyseus.joinById(roomId, { name }))
      }

      return room
    },
    [colyseus],
  )

  const joinRoom = useCallback(
    async (
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
    },
    [joinRoomWithReconnect],
  )

  const onCreateRoom = () => {
    createRoom().then((room) => {
      if (room) setRoom(room)
    })
  }

  const onJoinRoom = useCallback(
    (roomId, name = getName()) =>
      joinRoom(roomId, name, (room) => setRoom(room)),
    [joinRoom, setRoom],
  )

  useEffect(() => {
    if (!colyseus) return
    const getAvailableRooms = async () => {
      const rooms = await colyseus.getAvailableRooms()
      if (rooms.length === 0) return

      setAvailableRooms(rooms)
    }

    intervalRef.current = setInterval(
      getAvailableRooms,
      process.env.NODE_ENV === 'production' ? 3000 : 500,
    )
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [colyseus, onJoinRoom])

  useEffect(() => {
    if (!availableRooms) return
    const lastRoom = availableRooms.find((room) =>
      localStorage.getItem(room.roomId),
    )

    if (lastRoom && !autoConnectAttempted.current) {
      autoConnectAttempted.current = true
      onJoinRoom(lastRoom.roomId)
    }
  }, [availableRooms, onJoinRoom])

  return (
    <main>
      <h1>Keltis</h1>

      <div className="space-y-6">
        <div className="space-2">
          {availableRooms.map((room) => (
            <div
              className="border rounded-lg p-2"
              key={room.roomId}
              onClick={() => onJoinRoom(room.roomId)}
            >
              {room.metadata?.roomName || room.roomId}
            </div>
          ))}
        </div>

        <button onClick={() => onCreateRoom()}>Create Game</button>
      </div>
    </main>
  )
}

export default Lobby
