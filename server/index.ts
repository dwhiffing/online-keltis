import { Server } from 'colyseus'
import http from 'http'
import express from 'express'
import path from 'path'
import { GameRoom } from './Room'

// import { monitor } from '@colyseus/monitor'
// import basicAuth from 'express-basic-auth'

export const port = Number(process.env.PORT || 8080)
export const endpoint = 'localhost'

export let STATIC_DIR: string

const app = express()
const gameServer = new Server({ server: http.createServer(app) })

gameServer.define('game', GameRoom)

if (process.env.NODE_ENV !== 'production') {
  STATIC_DIR = path.resolve(__dirname, '..')
} else {
  STATIC_DIR = path.resolve(__dirname, 'public')
}

app.use('/', express.static(STATIC_DIR))

// const auth = basicAuth({ users: { admin: 'admin' }, challenge: true })
// app.use('/colyseus', auth, monitor())

gameServer.listen(port)
console.log(`Listening on http://${endpoint}:${port}`)
