import { loginUser, userInfo } from "../api";
import { ByRef, Component, domAddEvent, domSelectId, html } from "../framework";
import { Session } from "../session";
import { generateId, RouterPath } from "../utils";

export class Login implements Component {
    private usernameFieldId = generateId("usernameField");
    private passwordFieldId = generateId("usernameField");
    private loginButtonId = generateId("loginButton");
    private loginContainerId = generateId("loginContainer");
    private loginLinkId = generateId("registerLink");
    private errorMessage = "";

    public constructor(
        private router: RouterPath,
        private session: ByRef<Session | null>,
    ) {}

    public render() {
        return html`
            <div class="auth-container" id="${this.loginContainerId}">
                <h2>Login</h2>
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
        domAddEvent(this.loginButtonId, "click", async () => {
            const response = await loginUser({
                username: domSelectId<HTMLInputElement>(this.usernameFieldId)
                    .value,
                password: domSelectId<HTMLInputElement>(this.passwordFieldId)
                    .value,
            });
            if (response.ok) {
                const infoResponse = await userInfo({
                    token: response.token!,
                });
                this.session.value = {
                    token: response.token!,
                    userId: infoResponse.user_id!,
                    username: infoResponse.username!,
                    role: infoResponse.role!,
                };
                this.router.routeTo("/");
            } else {
                this.errorMessage = response.msg;
            }
            update();
        });
        domAddEvent(this.loginLinkId, "click", () => {
            this.router.routeTo("/register");
            update();
        });
    }
}
