import { ByRef, Component, domAddEvent, html } from "../framework";
import { Session } from "../session";
import { generateId, RouterPath } from "../utils";

export class Login implements Component {
    private usernameFieldId = generateId("usernameField");
    private passwordFieldId = generateId("usernameField");
    private loginButtonId = generateId("loginButton");
    private loginContainerId = generateId("loginContainer");
    private loginLinkId = generateId("registerLink");

    public constructor(
        private router: RouterPath,
        private session: ByRef<Session | null>,
    ) {}

    public render() {
        return html`
            <div class="auth-container" id="${this.loginContainerId}">
                <h2>Login</h2>
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
                <button id="${this.loginButtonId}">Login</button>
                <p>
                    Don't have an account?
                    <a class="link" id="${this.loginLinkId}">Register</a>
                    here
                </p>
            </div>
        `;
    }

    public hydrate(update: () => void): void {
        domAddEvent(this.loginButtonId, "click", () => {
            this.session.value = {
                id: 0,
                userId: 0,
                username: "testuser",
            };
            this.router.routeTo("/");
            update();
        });
        domAddEvent(this.loginLinkId, "click", () => {
            this.router.routeTo("/register");
            update();
        });
    }
}
