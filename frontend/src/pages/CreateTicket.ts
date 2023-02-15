import { Session } from "../session"
import { ByRef, Component, domAddEvent, html } from "../framework"
import { generateId, Router } from "../utils";
import { openTicket } from "../api";


export class CreateTicket implements Component {

    private errorMessage = "";
    private formId = generateId();

    public constructor(
        private router: Router,
        private session: ByRef<Session | null>,
    ) { }

    public render() {
        return html`
            <h1>Create ticket</h1>
            ${this.errorMessage !== "" ? html`<p class="error-text">${this.errorMessage}</p>` : ""}
            <form id="${this.formId}">
                <input placeholder="Title" name="title">
                <br>
                <textarea placeholder="Content" name="content"></textarea>
                <br>
                <select name="type">
                    <option>Request</option>
                    <option>Incident</option>
                </select>
                <br>
                <input type="submit" value="Create">
            </form>
        `;
    }

    public hydrate(update: () => void): void {
        if (this.session.value === null) {
            this.router.routeTo("/login");
            return update();
        }

        domAddEvent<HTMLFormElement, "submit">(this.formId, "submit", async (event) => {
            event.preventDefault();
            const form = new FormData(event.target as HTMLFormElement)
            const response = await openTicket({
                token: this.session.value!.token,
                title: form.get("title")!.toString(),
                content: form.get("content")!.toString(),
                urgency: form.get("type")!.toString() as "Incident" | "Request",
            })
            if (!response.ok) {
                this.errorMessage = response.msg;
            } else {
                this.router.routeTo("/customer");
            }
            update();
        })
    }
}

