import { io, Socket } from "socket.io-client"

let socket: Socket | undefined

export function getSocket(): Socket {
  if (!socket) {
    socket = io({ path: "/api/rt/ws" })

    socket.on("heartbeat", () => {
      socket?.emit("heartbeat")
    })

    setInterval(() => {
      socket?.emit("heartbeat")
    }, 5000)
  }

  return socket
}
