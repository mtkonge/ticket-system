import { ByRef, Component, html } from "../framework"
import { Session } from "../session";


export class AdminPanel implements Component {
    public constructor(
        public session: ByRef<Session | null>,
    ) { }

    public render() {
        return html`
            <h1>admin panel</h1>
        `;
    }
}

