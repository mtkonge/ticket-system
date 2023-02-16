import { Component, domAddEvent, domSelectId, html } from "../framework"
import { generateId } from "../utils";
import { openTicket } from "../api";
import { Context } from "../Context";

export class CreateTicket implements Component {
    private errorMessage = "";
    private formId = generateId();
    private ticketTypeId = generateId();

    public constructor(private context: Context) {}

    public render() {
        return html`
            <center>
                <h1>Create ticket</h1>
                ${this.errorMessage !== "" ? html`<p class="error-text">${this.errorMessage}</p>` : ""}
                <form id="${this.formId}">
                    <div class="ticket">
                        <input class="title" placeholder="Title" name="title">
                        <br>
                        <textarea placeholder="Write your message here" name="content"></textarea>
                        <br>
                        <div class="flex" style="justify-content: center">
                            <span class="urgency request" data-name="request" tabindex="0">Request</span>
                            <span class="urgency selectable" data-name="incident" tabindex="0">Incident</span>
                        </div>
                        <input type="hidden" id="${this.ticketTypeId}" name="type" value="Request">
                    </div>
                    <br>
                    <button type="submit" class="brand-button">Create</button>
                </form>
            </center>
        `;
    }

    public hydrate(update: () => void): void {
        if (this.context.session === null) {
            this.context.router.routeTo("/login");
            return update();
        }

        domAddEvent<HTMLFormElement, "submit">(
            this.formId,
            "submit",
            async (event) => {
                event.preventDefault();
                const form = new FormData(event.target as HTMLFormElement);
                const response = await openTicket({
                    token: this.context.session!.token,
                    title: form.get("title")!.toString(),
                    content: form.get("content")!.toString(),
                    urgency: form.get("type")!.toString() as
                        | "Incident"
                        | "Request",
                });
                if (!response.ok) {
                    this.errorMessage = response.msg;
                } else {
                    this.context.ticketHasChangedAmountSinceLastTime = true;
                    this.context.router.routeTo("/customer");
                }
                update();
            },
        );

        document.querySelectorAll<HTMLSpanElement>(".urgency").forEach(type => {
            type.addEventListener("click", event => {
                if (!type.classList.contains("selectable")) return;

                document.querySelector<HTMLSpanElement>(".urgency:not(.selectable)")!.className = "urgency selectable";

                domSelectId<HTMLInputElement>(this.ticketTypeId).value = type.innerText;
                type.className = "urgency " + type.dataset.name!;
            });

            type.addEventListener("keydown", event => {
                if (event.key === "Enter") type.click();
            });
        });
    }
}
