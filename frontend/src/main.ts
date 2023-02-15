import { initiaizeApp, byRef } from "./framework";
import { Layout } from "./Layout";
import { Session } from "./session";

let session = byRef<Session | null>(null);

initiaizeApp(new Layout(session));

