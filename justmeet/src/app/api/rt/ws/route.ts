import type { NextApiRequest } from "next"
import type { NextApiResponse } from "next"
import type { Server as HTTPServer } from "http"
import { Server } from "socket.io"

export const config = {
  api: {
    bodyParser: false,
  },
}

type NextApiResponseWithSocket = NextApiResponse & {
  socket: NextApiResponse["socket"] & {
    server: HTTPServer & {
      io?: Server
    }
  }
}

function ioHandler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/rt/ws",
    })
    res.socket.server.io = io

    io.on("connection", (socket) => {
      let lastHeartbeat = Date.now()

      const interval = setInterval(() => {
        socket.emit("heartbeat")
        if (Date.now() - lastHeartbeat > 15000) {
          socket.disconnect(true)
        }
      }, 5000)

      socket.on("heartbeat", () => {
        lastHeartbeat = Date.now()
      })

      socket.on("disconnect", () => {
        clearInterval(interval)
      })
    })
  }
  res.end()
}

export async function GET(req: NextApiRequest, res: NextApiResponseWithSocket) {
  ioHandler(req, res)
}

export async function POST(req: NextApiRequest, res: NextApiResponseWithSocket) {
  ioHandler(req, res)
}
