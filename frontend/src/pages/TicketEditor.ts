import { ByRef, Component, html } from "../framework"
import { Session } from "../session";
import { Router } from "../utils";

export class TicketEditor implements Component {
    public constructor(
        private router: Router,
        private session: ByRef<Session | null>,
    ) { }

    public render() {
        return html`
            <h1>Ticket editor</h1>
        `;
    }
}

