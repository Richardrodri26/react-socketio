import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from 'http'
import cors from 'cors'
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { PORT } from './config.js'

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url))

const server = http.createServer(app)

const io = new SocketServer(server, {
  cors: {
    origin: 'http://localhost:5173'
  }
})

app.use(cors())
app.use(morgan('dev'))

io.on('connection', (socket) => {
  //console.log(socket.id)
  //console.log('a user connected')

  socket.on('message', (message) => {
    //console.log(message)
    socket.broadcast.emit('message', {
      body: message,
      from: socket.id
    })
  })
});

app.use(express.static(join(__dirname, '../client/dist')))

server.listen(PORT)
console.log(`Servidor inicio en el puerto ${PORT}`)