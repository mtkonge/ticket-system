import { Context } from "../Context";
import { Component, domAddEvent, domSelectId, html } from "../framework";
import { generateId } from "../utils";

export class Customer implements Component {
    private createTicketButtonId = generateId("createTicket");

    public constructor(private context: Context) {}

    public render() {
        return html`
            <div id="customer-tickets-container">
                <button class="brand-button" id="${this.createTicketButtonId}">
                    Create ticket
                </button>
                <table id="ticket-table">
                    <tr id="ticket-variables">
                        <th id="title">Title</th>
                        <th id="status">Status</th>
                        <th id="assigned-to">Assigned To</th>
                    </tr>
                    <tr id="ticket-row">
                        <td id="title">Jeg kan ikke finde mine bitcoins</td>
                        <td id="status">Open</td>
                        <td id="assigned-to">1st level</td>
                    </tr>
                </table>
            </div>
        `;
    }

    hydrate(update: () => void): void {
        if (this.context.session === null) {
            this.context.router.routeTo("/login");
            return update();
        }
        domAddEvent(this.createTicketButtonId, "click", () => {
            this.context.router.routeTo("/create_ticket");
            update();
        });
    }
}
