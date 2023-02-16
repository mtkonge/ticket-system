import { Ticket } from "./api";
import { Component, html } from "./framework";

export class TicketComponent implements Component {

    public constructor(
        private ticket: Ticket,
        private usernames: { [id: number]: string },
    ) { }

    public render() {
        return html`
            <div class="ticket">
                <span class="title">${this.ticket.title}</span>
                <br>
                <div class="flex">
                    <span class="urgency ${this.ticket.urgency.toLowerCase()}">${this.ticket.urgency}</span>
                    <span>by <b>${this.usernames[this.ticket.creator]}</b></span>
                </div>
                <div class="content">${this.ticket.content}</div>
                <div class="flex">
                    <span class="status ${this.ticket.status.toLowerCase()}">${this.ticket.status}</span>
                    <i class="assignee">Assigned to <b>${this.usernames[this.ticket.assignee]}</b></i>
                </div>
            </div>
        `;
    }

}
