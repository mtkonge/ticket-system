import { editTicket, oneTicket, postComment, Ticket, TicketStatus, TicketType, usernames } from "../api";
import { Context } from "../Context";
import { Component, domAddEvent, domSelectId, fetched, html } from "../framework"
import { generateId } from "../utils";

enum Mode {
    view,
    edit,
}

function editType(selectId: string, type: TicketType): string {
    return `
        <label for="${selectId}">Type: </label>
        <select name="type" id="${selectId}" class="brand-button">
            <option ${type === "Request" && "selected"}>Request</option>
            <option ${type === "Incident" && "selected"}>Incident</option>
        </select>
    `
}

function editStatus(selectId: string, status: TicketStatus): string {
    return `
        <label for="${selectId}">Status: </label>
        <select name="status" id="${selectId}" class="brand-button">
            <option ${status === "Open" && "selected"}>Open</option>
            <option ${status === "Pending" && "selected"}>Pending</option>
            <option ${status === "Resolved" && "selected"}>Resolved</option>
        </select>
    `
}

export class TicketEditor implements Component {
    private ticket = fetched<Ticket>();
    private usernames = fetched<{ [id: number]: string }>()
    private errorMessage = "";
    private addCommentFormId = generateId();
    private selectTypeId = generateId();
    private selectStatusId = generateId();
    private editFormId = generateId();
    private saveEditId = generateId();
    private editModeId = generateId();
    private mode = Mode.view;

    public constructor(
        private context: Context,
    ) { }

    public render() {
        if (this.ticket.data === undefined || this.usernames.data === undefined) {
            return `<h1>Loading ticket...</h1>
            ${this.errorMessage !== ""
                    ? html`<p class="error-text">${this.errorMessage}</p>`
                    : ""
                }
            </p>`
        }
        return `
            <div style="border-bottom: 1px solid #ccc;">
                <h1 style="margin-bottom: 0.5rem">[${this.ticket.data!.urgency}] [${this.ticket.data!.status}] ${this.ticket.data!.title} (#${this.ticket.data!.id})</h1>
                ${this.errorMessage !== ""
                ? html`<p class="error-text">${this.errorMessage}</p>`
                : ""}
                <h3 style="color: #aaa; margin: 0">Creator: ${this.usernames.data![this.ticket.data!.creator]} | Assigned to: ${this.usernames.data![this.ticket.data!.assignee]}</h3>
                <p>${this.ticket.data!.content}</p>
            </div>
            <form id="${this.editFormId}" style="border-bottom: 1px solid #ccc;">
                <input type="hidden" name="title" value="${this.ticket.data!.title}">
                <h4>Edit mode: <input type="checkbox" ${this.mode === Mode.edit ? "checked" : ""} id=${this.editModeId}></h4>
                <h4 style="${this.mode === Mode.view ? `display: none;` : "margin: 0;"}">${editStatus(this.selectStatusId, this.ticket.data!.status)} | ${editType(this.selectTypeId, this.ticket.data!.urgency)}</h4>
                <input type="${this.mode === Mode.edit ? "submit" : "hidden"}" id="${this.saveEditId}" value="Save edit" class="brand-button">
            </form>
            ${this.ticket.data!.comments.map(comment => `
                <div class="comment">
                    <p><b>${this.usernames.data![comment.creator]}</b></p>
                    <p>${comment.content}</p>
                </div>
                `).reduce((acc, curr) => acc + curr, "")
            }
            <form id="${this.addCommentFormId}" style="margin-top: 1rem">
                <textarea name="content" placeholder = "Content..."></textarea>
                <br>
                <input type="submit" value="Post comment" class="brand-button">
            </form>
            `
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

        if (this.ticket.data?.id !== ticketId) {
            this.ticket.isFetched = false;
            this.usernames.isFetched = false;
        }

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
            const saveEditForm = domSelectId<HTMLFormElement>(this.editFormId);

            domAddEvent<HTMLInputElement, "click">(this.editModeId, "click", async () => {
                this.mode = this.mode === Mode.edit ? Mode.view : Mode.edit;
                update();
            });

            domAddEvent<HTMLFormElement, "submit">(this.editFormId, "submit", async (event) => {
                event.preventDefault();
                const data = new FormData(saveEditForm);
                const response = await editTicket({
                    token: this.context.session!.token,
                    id: ticketId,
                    title: data.get("title")!.toString(),
                    urgency: data.get("type")!.toString() as TicketType,
                    status: data.get("status")!.toString() as TicketStatus,
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
                        return;
                    }
                }
                update();
            });

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
                        return;
                    }
                }
                update();
            });
        }
    }
}
