import { Session } from "../session"
import { ByRef, Component, html } from "../framework"
import { Router } from "../utils";


export class CreateTicket implements Component {
    public constructor(
        private router: Router,
        private session: ByRef<Session | null>,
    ) { }

    public render() {
        return html`
            
        `;
    }
}

