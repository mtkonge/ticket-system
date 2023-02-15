import { Component, domAddEvent, domSelectId, html } from "../framework";
import { generateId } from "../utils";

export class Customer implements Component {
    private createTicketButtonId = generateId("createTicket");

    public render() {
        return html`
            <div id="create-ticket-container" class="modal">
                <div id="create-ticket-content" class="modal-content">
                    <span id="close-modal" class="close">&times;</span>
                    <p>Create ticket</p>
                </div>
            </div>
            <div id="customer-tickets-container">
                <button class="create-ticket" id="${this.createTicketButtonId}">
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
        domAddEvent(this.createTicketButtonId, "click", () => {
            domSelectId("create-ticket-container").style.display = "block";
            update();
        });
        domAddEvent("close-modal", "click", () => {
            domSelectId("create-ticket-container").style.display = "none";
        });
        document.body.onclick = (event) => {
            if (event.target == domSelectId("create-ticket-container")) {
                domSelectId("create-ticket-container").style.display = "none";
            }
        };
    }
}
