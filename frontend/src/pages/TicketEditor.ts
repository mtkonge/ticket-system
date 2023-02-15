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
}

