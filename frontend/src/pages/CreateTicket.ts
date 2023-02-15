import { Session } from "../session"
import { ByRef, Component, html } from "../framework"
import { RouterPath } from "../utils";


export class CreateTicket implements Component {
    public constructor(
        private router: RouterPath,
        private session: ByRef<Session | null>,
    ) { }

    public render() {
        return html`
            
        `;
    }
}

