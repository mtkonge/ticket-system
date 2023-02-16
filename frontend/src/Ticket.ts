import { Ticket } from "./api";
import { Component, domAddEvent, Fetched, fetched, html } from "./framework";

export class TicketComponent implements Component {

    public constructor(private ticket: Ticket, private usernames: { [id: number]: string } ) { console.log(this.usernames) }

    public render() {
        return `
            <div class="ticket">
                <span class="title">${this.ticket.title}</span>
                <br>
                <div class="flex">
                    <span class="status open">Open</span>
                    <span>by <b>${this.usernames[this.ticket.creator]}</b></span>
                </div>
                <div class="content">${this.ticket.content}</div>
                <div class="flex">
                    <span class="urgency ${this.ticket.urgency.toLowerCase()}">${this.ticket.urgency}</span>
                    <i class="assignee">Assigned to <b>${this.usernames[this.ticket.assignee]}</b></i>
                </div>
            </div>
        `;
    }

}
