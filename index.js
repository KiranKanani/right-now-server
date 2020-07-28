import http from "http"
import SocketIO from 'socket.io'
import app from "./server"
import {conncetSocket} from './api/livesteraming/socket.io'
let server = null;

if (process.env.NODE_ENV === "development") {
    server = http.createServer(app)
  } else {
    console.log("This is the production environment")
    server = http.createServer(app)
  }
export var io = SocketIO(server)
conncetSocket();

const PORT = process.env.PORT || 8000
server.listen(PORT, async () => {
  try {
    console.log(`Server listening on port ${PORT}`)
  } catch (err) {
    console.log("Server init error", err)
  }
})
