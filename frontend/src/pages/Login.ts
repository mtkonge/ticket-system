import { loginUser, userInfo } from "../api";
import { Context } from "../Context";
import { Component, domAddEvent, domSelectId, html } from "../framework";
import { generateId, } from "../utils";

export class Login implements Component {
    private usernameFieldId = generateId("usernameField");
    private passwordFieldId = generateId("usernameField");
    private loginButtonId = generateId("loginButton");
    private loginContainerId = generateId("loginContainer");
    private loginLinkId = generateId("registerLink");
    private errorMessage = "";

    public constructor(
        private context: Context,
    ) { }

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
                <button id="${this.loginButtonId}" class="brand-button">Login</button>
                <p>
                    Don't have an account?
                    <a class="link" id="${this.loginLinkId}">Register</a>
                    here
                </p>
            </div>
        `;
    }

    public hydrate(update: () => void): void {
        this.errorMessage = "";
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
                this.context.session = {
                    token: response.token!,
                    userId: infoResponse.user_id!,
                    username: infoResponse.username!,
                    role: infoResponse.role!,
                };
                this.context.router.routeTo("/");
            } else {
                this.errorMessage = response.msg;
            }
            update();
        });
        domAddEvent(this.loginLinkId, "click", () => {
            this.context.router.routeTo("/register");
            update();
        });
    }
}
