import { oneTicket, postComment } from "../api";
import { Context } from "../Context";
import { Component, domAddEvent, domSelectId, html } from "../framework"
import { generateId } from "../utils";

export class TicketEditor implements Component {
    private errorMessage = "";
    private addCommentFormId = generateId();

    public constructor(
        private context: Context,
    ) { }

    public render() {
        return `
            <h1>Ticket editor</h1>
            ${this.errorMessage !== ""
                ? html`<p class="error-text">${this.errorMessage}</p>`
                : ""}
            <pre><code>${this.context.currentTicketEdit !== null
                ? JSON.stringify(this.context.currentTicketEdit, null, 4)
                : ""}</code></pre>
            <h2>Add comment</h2>
            <form id="${this.addCommentFormId}">
                <textarea name="content" placeholder="Content..."></textarea>
                <br>
                <input type="submit" value="Post comment">
            </form>
        `;
    }

    public hydrate(update: () => void): void {
        if (this.context.currentTicketEdit === null) {
            this.context.router.routeTo("/")
            return update();
        } else if (this.context.session === null) {
            this.context.router.routeTo("/login")
            return update();
        }

        const addCommentForm = domSelectId<HTMLFormElement>(this.addCommentFormId);
        domAddEvent<HTMLFormElement, "submit">(this.addCommentFormId, "submit", async (event) => {
            event.preventDefault();
            const data = new FormData(addCommentForm);
            const response = await postComment({
                token: this.context.session!.token,
                id: this.context.currentTicketEdit!.id,
                content: data.get("content")!.toString(),
            });
            if (!response.ok) {
                this.errorMessage = response.msg
            } else {
                const ticketInfoResponse = await oneTicket({
                    token: this.context.session!.token,
                    id: this.context.currentTicketEdit!.id,
                });
                if (!ticketInfoResponse.ok) {
                    this.errorMessage = ticketInfoResponse.msg;
                } else {
                    this.context.currentTicketEdit = ticketInfoResponse.ticket;
                }
            }
            update();
        });
    }
}

