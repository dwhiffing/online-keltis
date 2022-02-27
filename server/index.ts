import { Server } from 'colyseus'
import http from 'http'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { GameRoom } from './Room'
// import { monitor } from '@colyseus/monitor'
// import basicAuth from 'express-basic-auth'

export let STATIC_DIR: string

if (process.env.NODE_ENV !== 'production') {
  STATIC_DIR = path.resolve(__dirname, '..')
} else {
  STATIC_DIR = path.resolve(__dirname, 'public')
}

export const port = Number(process.env.PORT || 3553)
const app = express()

app.use(cors())
app.use(express.json())

const server = http.createServer(app)
const gameServer = new Server({ server })

gameServer.define('game', GameRoom)

app.use('/', express.static(STATIC_DIR))
gameServer.listen(port)

console.log(`Listening on http://localhost:${port}`)

// const auth = basicAuth({ users: { admin: 'admin' }, challenge: true })
// app.use('/colyseus', auth, monitor())
