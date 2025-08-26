import JitsiClient from "./JitsiClient";
import { getJitsiCredentials } from "@/lib/jitsi";

interface Params {
  params: { id: string };
}

export default function SessionPage({ params }: Params) {
  const { roomName, jwt } = getJitsiCredentials(params.id);

  return (
    <main className="h-screen w-screen">
      <JitsiClient roomName={roomName} jwt={jwt} />
    </main>
  );
}
