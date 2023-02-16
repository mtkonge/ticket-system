import { Ticket, userCreatedTickets, usernames } from "../api";
import { Context } from "../Context";
import { Component, domAddEvent, fetched, html } from "../framework";
import { TicketComponent } from "../TicketComponent";
import { generateId } from "../utils";

export class Customer implements Component {
    private createTicketButtonId = generateId("createTicket");
    private tickets = fetched<Ticket[]>();
    private usernames = fetched<{ [id: number]: string }>();
    private errorMessage = "";
    private ticketComponents: TicketComponent[] = [];

    public constructor(private context: Context) {}

    public render() {
        return html`
            <div class="customer-tickets-container">
                ${this.errorMessage !== ""
                    ? html`<p class="error-text">${this.errorMessage}</p>`
                    : ""}
                <button class="brand-button" id="${this.createTicketButtonId}">
                    Create ticket
                </button>
                <br /><br />
                ${this.ticketComponents
                    .map((ticket) => ticket.render())
                    .join("<br>")}
            </div>
        `;
    }

    hydrate(update: () => void): void {
        this.errorMessage = "";
        if (this.context.session === null) {
            this.context.router.routeTo("/login");
            return update();
        }
        if (
            !this.tickets.isFetched ||
            this.context.ticketHasChangedAmountLastTime
        ) {
            userCreatedTickets({ token: this.context.session.token }).then(
                (response) => {
                    if (!response.ok) {
                        this.errorMessage = response.msg;
                    } else {
                        this.tickets.data = response.tickets;
                    }
                    this.tickets.isFetched = true;
                    this.context.ticketHasChangedAmountLastTime = false;
                    update();
                },
            );
        }

        if (!this.usernames.isFetched && this.tickets.isFetched) {
            usernames({
                user_ids: this.tickets
                    .data!.map((ticket) => ticket.assignee)
                    .concat(this.tickets.data!.map((ticket) => ticket.creator)),
            }).then((response) => {
                this.usernames.data = response.usernames.reduce(
                    (acc, { id, name }) => ({ ...acc, [id]: name }),
                    {},
                );
                this.usernames.isFetched = true;
                this.showTickets();
                update();
            });
        }
<<<<<<< HEAD
=======
        if (this.usernames.isFetched && this.tickets.isFetched) {
            this.tickets.data!.forEach((ticket, i) => {
                document.querySelectorAll(".ticket")[i].addEventListener("click", () => {
                    this.usernames.isFetched = false;
                    this.tickets.isFetched = false;
                    this.context.router.routeTo(
                        "/ticket_editor",
                        `?ticket=${ticket.id}`,
                    );
                    update();
                });
            });
        }
>>>>>>> 79497bc (Frontend: Add design for ticket creator)
        domAddEvent(this.createTicketButtonId, "click", () => {
            this.tickets.isFetched = false;
            this.usernames.isFetched = false;
            this.context.router.routeTo("/create_ticket");
            update();
        });
    }

    private showTickets() {
        if (this.tickets.isFetched && this.usernames.isFetched) {
            this.ticketComponents = this.tickets.data!.map(
                (ticket) => new TicketComponent(ticket, this.usernames.data!),
            );
        }
    }
}
