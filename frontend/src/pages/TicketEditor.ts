import { oneTicket, postComment, Ticket, usernames } from "../api";
import { Context } from "../Context";
import { Component, domAddEvent, domSelectId, fetched, html } from "../framework"
import { generateId } from "../utils";

export class TicketEditor implements Component {
    private ticket = fetched<Ticket>();
    private usernames = fetched<{ [id: number]: string }>()
    private errorMessage = "";
    private addCommentFormId = generateId();

    public constructor(
        private context: Context,
    ) { }

    public render() {
        if (this.ticket.data === undefined) {
            return `<h1>Henter ticket...</h1>
            ${this.errorMessage !== ""
                    ? html`<p class="error-text">${this.errorMessage}</p>`
                    : ""
                }
            </p>`
        }
        return `
            <h1>[${this.ticket.data!.status}] ${this.ticket.data!.title} (#${this.ticket.data!.id})</h1>
            ${this.errorMessage !== ""
                ? html`<p class="error-text">${this.errorMessage}</p>`
                : ""
            }
            <p>${this.ticket.data!.content}</p>
            <h2>Add comment</h2>
            <form id="${this.addCommentFormId}">
                <textarea name="content" placeholder = "Content..."></textarea>
                <br>
                <input type="submit" value="Post comment">
            </form>
            `
        /*
        return `
            <h1>[${this.ticket.data.status}] ${this.context.currentTicketEdit!.title} (#${this.context.currentTicketEdit!.id})</h1>
            ${this.errorMessage !== ""
                ? html`<p class="error-text">${this.errorMessage}</p>`
                : ""
            }
        <pre><code>${this.context.currentTicketEdit !== null
                ? JSON.stringify(this.context.currentTicketEdit, null, 4)
                : ""
            } </code></pre>

            <h2>Add comment</h2>
                <form id = "${this.addCommentFormId}">
                    <textarea name="content" placeholder = "Content..."></textarea>
                    <br>
                    <input type="submit" value = "Post comment">
                    </form>
            <h2>Comments</h2>`;
            */
    }

    public hydrate(update: () => void): void {
        const searchParams = new URLSearchParams(location.search);
        const maybeTicketId = searchParams.get("ticket");
        if (maybeTicketId === null) {
            this.context.router.routeTo("/")
            return update();
        } else if (this.context.session === null) {
            this.context.router.routeTo("/login")
            return update();
        }
        const ticketId = parseInt(maybeTicketId);

        if (!this.ticket.isFetched) {
            oneTicket({ id: ticketId, token: this.context.session.token })
                .then((response) => {
                    if (!response.ok) {
                        this.errorMessage = response.msg;
                    } else {
                        this.ticket.data = response.ticket;
                    }
                    this.ticket.isFetched = true;
                    update();
                })
        }
        if (!this.usernames.isFetched && this.ticket.isFetched) {
            const user_ids = [this.ticket.data!.assignee, this.ticket.data!.creator, ...this.ticket.data!.comments.map(comment => comment.creator)];
            usernames({
                user_ids,
            }).then((response) => {
                this.usernames.data = response.usernames.reduce((acc, { id, name }) => ({ ...acc, [id]: name }), {});
                this.usernames.isFetched = true;
                update();
            });
        }
        if (this.usernames.isFetched && this.ticket.isFetched) {
            const addCommentForm = domSelectId<HTMLFormElement>(this.addCommentFormId);
            domAddEvent<HTMLFormElement, "submit">(this.addCommentFormId, "submit", async (event) => {
                event.preventDefault();
                const data = new FormData(addCommentForm);
                const response = await postComment({
                    token: this.context.session!.token,
                    id: ticketId,
                    content: data.get("content")!.toString(),
                });
                if (!response.ok) {
                    this.errorMessage = response.msg
                } else {
                    const ticketInfoResponse = await oneTicket({
                        token: this.context.session!.token,
                        id: ticketId,
                    });
                    if (!ticketInfoResponse.ok) {
                        this.errorMessage = ticketInfoResponse.msg;
                    } else {
                        this.ticket.data = ticketInfoResponse.ticket;
                        update();
                    }
                }
                update();
            });
        }
    }
}
