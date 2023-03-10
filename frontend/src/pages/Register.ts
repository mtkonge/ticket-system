import { loginUser, registerUser, RegisterUserRequest, userInfo } from "../api";
import { Context } from "../Context";
import { ByRef, Component, domAddEvent, domSelectId, html } from "../framework";
import { Session } from "../session";
import { generateId, Router } from "../utils";

export class Register implements Component {
    private usernameFieldId = generateId("usernameField");
    private passwordFieldId = generateId("usernameField");
    private registerButtonId = generateId("registerButton");
    private registerContainerId = generateId("registerContainer");
    private registerLinkId = generateId("registerLink");
    private errorMessage = "";

    public constructor(
        private context: Context,
    ) { }

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
                <button id="${this.registerButtonId}" class="brand-button">Register</button>

                <p>
                    Already have an account?
                    <a href="#" class="link" id="${this.registerLinkId}">Login</a> here
                </p>
            </div>
        `;
    }

    public hydrate(update: () => void): void {
        this.errorMessage = "";
        domAddEvent(this.registerButtonId, "click", async () => {
            const credentials: RegisterUserRequest = {
                username: domSelectId<HTMLInputElement>(this.usernameFieldId)
                    .value,
                password: domSelectId<HTMLInputElement>(this.passwordFieldId)
                    .value,
            };
            const registerResponse = await registerUser(credentials);
            if (!registerResponse.ok) {
                this.errorMessage = registerResponse.msg;
            }
            const loginResponse = await loginUser({
                username: domSelectId<HTMLInputElement>(this.usernameFieldId)
                    .value,
                password: domSelectId<HTMLInputElement>(this.passwordFieldId)
                    .value,
            });
            if (loginResponse.ok) {
                const infoResponse = await userInfo({
                    token: loginResponse.token!
                });
                this.context.session = {
                    token: loginResponse.token!,
                    userId: infoResponse.user_id!,
                    username: infoResponse.username!,
                    role: infoResponse.role!,
                };
                this.context.router.routeTo("/");
            } else {
                this.errorMessage = loginResponse.msg;
            }
            update();
        });
        domAddEvent(this.registerLinkId, "click", () => {
            this.context.router.routeTo("/login");
            update();
        });
    }
}
