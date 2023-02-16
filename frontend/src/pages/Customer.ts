import { Ticket, userCreatedTickets, usernames } from "../api";
import { Context } from "../Context";
import { Component, domAddEvent, fetched, html } from "../framework";
import { generateId } from "../utils";

export class Customer implements Component {
    private createTicketButtonId = generateId("createTicket");
    private tickets = fetched<Ticket[]>();
    private usernames = fetched<{ [id: number]: string }>()
    private errorMessage = "";

    public constructor(private context: Context) { }

    public render() {
        return html`
            <div class="customer-tickets-container">
                ${this.errorMessage !== ""
                ? html`<p class="error-text">${this.errorMessage}</p>`
                : ""}
                <button class="brand-button" id="${this.createTicketButtonId}">
                    Create ticket
                </button>
                <table class="table">
                    <tr class="ticket-variables">
                        <th class="title">Title</th>
                        <th class="type">Type</th>
                        <th class="assigned-to">Assigned To</th>
                    </tr>
                    ${this.tickets.isFetched && this.usernames.isFetched
                ? this.tickets.data!.map((ticket, i) => html`
                            <tr class="ticket-row" id="${"random" + i}">
                                <td class="title">${ticket.title}</td>
                                <td class="type">${ticket.urgency || ""}</td>
                                <td class="assigned-to">${this.usernames.data![ticket.assignee]}</td>
                            </tr>
                        `).join("") : ""}
                </table>
            </div>
        `;
    }

    hydrate(update: () => void): void {
        this.errorMessage = "";
        if (this.context.session === null) {
            this.context.router.routeTo("/login");
            return update();
        }
        if (!this.tickets.isFetched) {
            userCreatedTickets({ token: this.context.session.token })
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
                user_ids: this.tickets.data!.map((ticket) => ticket.assignee),
            }).then((response) => {
                this.usernames.data = response.usernames.reduce((acc, { id, name }) => ({ ...acc, [id]: name }), {});
                this.usernames.isFetched = true;
                update();
            });
        }
        if (this.usernames.isFetched && this.tickets.isFetched) {
            this.tickets.data!.forEach((ticket, i) => {
                domAddEvent<HTMLTableRowElement, "click">("random" + i, "click", () => {
                    this.context.currentTicketEdit = ticket;
                    this.usernames.isFetched = false;
                    this.tickets.isFetched = false;
                    this.context.router.routeTo("/ticket_editor");
                    update();
                })
            })
        }
        domAddEvent(this.createTicketButtonId, "click", () => {
            this.tickets.isFetched = false;
            this.usernames.isFetched = false;
            this.context.router.routeTo("/create_ticket");
            update();
        });
    }
}
