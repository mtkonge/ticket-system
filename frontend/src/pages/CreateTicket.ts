import { Session } from "../session"
import { ByRef, Component, html } from "../framework"
import { Router } from "../utils";


export class CreateTicket implements Component {
    public constructor(
        private router: Router,
        private session: ByRef<Session | null>,
    ) { }

    public render() {
        return html`
            <h1>Create ticket</h1>
            <form>
                <input placeholder="Title" name="tile">
                <br>
                <textarea placeholder="Content"></textarea>
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
    }
}

