import { ByRef, Component, domAddEvent, html } from "../framework";
import { Session } from "../session";
import { generateId, RouterPath } from "../utils";

export class Login implements Component {
    private testuserLoginButtonId = generateId("testuserButton");

    public constructor(
        private router: RouterPath,
        private session: ByRef<Session | null>,
    ) { }

    public render() {
        return html`
            <button id="${this.testuserLoginButtonId}" >Login as test user</button>
        `;
    }

    public hydrate(update: () => void): void {
        domAddEvent(this.testuserLoginButtonId, "click", () => {
            this.session.value = {
                id: 0,
                userId: 0,
                username: "testuser",
            };
            this.router.routeTo("/");
            update();
        })
    }
}

