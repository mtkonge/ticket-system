import { Context } from "../Context";
import { Component, html } from "../framework"

export class TicketEditor implements Component {
    public constructor(
        private context: Context,
    ) { }

    public render() {
        return html`
            <h1>Ticket editor</h1>
        `;
    }

    public hydrate(update: () => void): void {
        if (this.context.currentTicketEditId === null) {
            this.context.router.routeTo("/")
            return update();
        }

    }
}

