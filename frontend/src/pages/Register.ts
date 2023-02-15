import { ByRef, Component, domAddEvent, html } from "../framework";
import { Session } from "../session";
import { generateId, RouterPath } from "../utils";

export class Register implements Component {
    private usernameFieldId = generateId("usernameField");
    private passwordFieldId = generateId("usernameField");
    private registerButtonId = generateId("registerButton");
    private registerContainerId = generateId("registerContainer");
    private registerLinkId = generateId("registerLink");

    public constructor(
        private router: RouterPath,
        private session: ByRef<Session | null>,
    ) {}

    public render() {
        return html`
            <div class="auth-container" id="${this.registerContainerId}">
                <h2>Register</h2>
                <input
                    id="${this.usernameFieldId}"
                    type="text"
                    placeholder="username"
                />
                <input
                    id="${this.passwordFieldId}"
                    type="text"
                    placeholder="password"
                />
                <button id="${this.registerButtonId}">Register</button>
                <p>
                    Already have an account?
                    <a class="link" id="${this.registerLinkId}">Login</a> here
                </p>
            </div>
        `;
    }

    public hydrate(update: () => void): void {
        domAddEvent(this.registerButtonId, "click", () => {
            this.session.value = {
                id: 0,
                userId: 0,
                username: "testuser",
            };
            this.router.routeTo("/");
            update();
        });
        domAddEvent(this.registerLinkId, "click", () => {
            this.router.routeTo("/login");
            update();
        });
    }
}
