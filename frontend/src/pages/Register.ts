import { registerUser, RegisterUserRequest } from "../api";
import { ByRef, Component, domAddEvent, domSelectId, html } from "../framework";
import { Session } from "../session";
import { generateId, RouterPath } from "../utils";

export class Register implements Component {
    private usernameFieldId = generateId("usernameField");
    private passwordFieldId = generateId("usernameField");
    private registerButtonId = generateId("registerButton");
    private registerContainerId = generateId("registerContainer");
    private registerLinkId = generateId("registerLink");
    private errorMessage = "";

    public constructor(
        private router: RouterPath,
        private session: ByRef<Session | null>,
    ) {}

    public render() {
        return html`
            <div class="auth-container" id="${this.registerContainerId}">
                <h2>Register</h2>
                ${this.errorMessage !== ""
                    ? html`<p class="error-text">${this.errorMessage}</p>`
                    : ""}
                <p class="error-text"></p>
                <input
                    id="${this.usernameFieldId}"
                    type="text"
                    placeholder="username"
                />
                <input
                    id="${this.passwordFieldId}"
                    type="password"
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
        domAddEvent(this.registerButtonId, "click", async () => {
            const credentials: RegisterUserRequest = {
                username: domSelectId<HTMLInputElement>(this.usernameFieldId)
                    .value,
                password: domSelectId<HTMLInputElement>(this.passwordFieldId)
                    .value,
            };
            const response = await registerUser(credentials);
            if (response.ok) {
                this.router.routeTo("/");
            } else {
                this.errorMessage = response.msg;
            }
            update();
        });
        domAddEvent(this.registerLinkId, "click", () => {
            this.router.routeTo("/login");
            update();
        });
    }
}
