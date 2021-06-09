import { Server } from 'socket.io'
import { io } from 'socket.io-client'
import { generateKeyPair } from 'crypto'

const server = new Server({
  pingInterval: 5000,
  pingTimeout: 5000,
})
server.listen(9997)

const client = io('ws://localhost:9997', {
  transports: ['websocket'],
  reconnection: true,
})
client.on('connect', () => {
  console.log('connect to localhost:9997')
})

client.on('disconnect', (reason) => {
  console.log('disconnect', reason)
})
