import jwt from "jsonwebtoken"

const appId = process.env.JITSI_APP_ID || ""
const secret = process.env.JITSI_SECRET || ""
const domain = process.env.JITSI_DOMAIN || "meet.jit.si"

export function getJitsiCredentials(roomName: string) {
  const payload = {
    aud: appId,
    iss: appId,
    sub: domain,
    room: roomName
  }

  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: "1h"
  })

  return { roomName, jwt: token }
}
