"use client";

import { useEffect, useRef } from "react";

interface Props {
  roomName: string;
  jwt: string;
}

export default function JitsiClient({ roomName, jwt }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => {
      // @ts-expect-error Jitsi API is not typed
      const domain = process.env.NEXT_PUBLIC_JITSI_DOMAIN || "meet.jit.si";
      // @ts-expect-error Jitsi API is not typed
      new window.JitsiMeetExternalAPI(domain, {
        parentNode: containerRef.current,
        roomName,
        jwt
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [roomName, jwt]);

  return <div ref={containerRef} className="h-full w-full" />;
}
