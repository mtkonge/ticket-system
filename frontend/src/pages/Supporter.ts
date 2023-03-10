import { Ticket, userAssignedTickets, usernames } from "../api";
import { Context } from "../Context";
import { Component, domAddEvent, domSelectId, fetched, html } from "../framework";

export class Supporter implements Component {
    private tickets = fetched<Ticket[]>();
    private usernames = fetched<{ [id: number]: string }>()
    private errorMessage = "";

    public constructor(
        private context: Context,
    ) { }

    public render() {
        return /*html*/ `
            <h1>Welcome to ticket-system</h1>
            ${this.errorMessage !== ""
                ? html`<p class="error-text">${this.errorMessage}</p>`
                : ""}
            <table class="table">
                <tr class="ticket-variables">
                    <th class="creator">Creator</th>
                    <th class="title">Title</th>
                    <th class="type">Type</th>
                    <th class="assigned-to">Assigned To</th>
                </tr>
                ${this.tickets.isFetched && this.usernames.isFetched
                ? this.tickets.data!.map((ticket, i) => html`
                    <tr class="ticket-row" id="${"random" + i}">
                        <td class="creator">${this.usernames.data![ticket.creator]}</td>
                        <td class="title">${ticket.title}</td>
                        <td class="type">${ticket.urgency || ""}</td>
                        <td class="assigned-to">${this.usernames.data![ticket.assignee]}</td>
                    </tr>
                `).join("") : ""}
            </table>
        `;
    }

    public hydrate(update: () => void): void {
        this.errorMessage = "";
        if (this.context.session === null) {
            this.context.router.routeTo("/login")
            return update();
        }
        if (!this.tickets.isFetched) {
            userAssignedTickets({ token: this.context.session.token })
                .then((response) => {
                    if (!response.ok) {
                        this.errorMessage = response.msg;
                    } else {
                        this.tickets.data = response.tickets;
                    }
                    this.tickets.isFetched = true;
                    update();
                })
        }
        if (!this.usernames.isFetched && this.tickets.isFetched) {
            usernames({
                user_ids: this.tickets.data!.map((ticket) => ticket.assignee).concat(this.tickets.data!.map((ticket) => ticket.creator)),
            }).then((response) => {
                this.usernames.data = response.usernames.reduce((acc, { id, name }) => ({ ...acc, [id]: name }), {});
                this.usernames.isFetched = true;
                update();
            });
        }
        if (this.usernames.isFetched && this.tickets.isFetched) {
            this.tickets.data!.forEach((ticket, i) => {
                domAddEvent<HTMLTableRowElement, "click">("random" + i, "click", () => {
                    this.usernames.isFetched = false;
                    this.tickets.isFetched = false;
                    this.context.router.routeTo("/ticket_editor", `?ticket=${ticket.id}`);
                    update();
                })
            })
        }
    }
}
