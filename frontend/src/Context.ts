import { Session } from "./session"
import { Router } from "./utils"

export type Context = {
    router: Router,
    session: Session | null,
    currentTicketEditId: number | null,
}

