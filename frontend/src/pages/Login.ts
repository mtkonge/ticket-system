import { loginUser, userInfo } from "../api";
import { ByRef, Component, domAddEvent, domSelectId, html } from "../framework";
import { Session } from "../session";
import { generateId, Router } from "../utils";

export class Login implements Component {
    private usernameFieldId = generateId("usernameField");
    private passwordFieldId = generateId("usernameField");
    private loginButtonId = generateId("loginButton");
    private loginContainerId = generateId("loginContainer");
    private loginLinkId = generateId("registerLink");
    private errorMessage = "";

    private devConsumerLoginId = generateId();
    private devLevelOneLoginId = generateId();
    private devAdminLoginId = generateId();

    public constructor(
        private router: Router,
        private session: ByRef<Session | null>,
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
                <button id="${this.devConsumerLoginId}" class="brand-button">Dev Consumer Login</button>
                <button id="${this.devLevelOneLoginId}" class="brand-button">Dev Level One Login</button>
                <button id="${this.devAdminLoginId}" class="brand-button">Dev Admin Login</button>
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
        domAddEvent(this.devLevelOneLoginId, "click", () => {
            this.session.value = {
                token: "123",
                userId: 0,
                username: "testuser",
                role: "LevelOne",
            };
            this.router.routeTo("/");
            update();
        });
        domAddEvent(this.devConsumerLoginId, "click", () => {
            this.session.value = {
                token: "123",
                userId: 0,
                username: "testuser",
                role: "Consumer",
            };
            this.router.routeTo("/");
            update();
        });
        domAddEvent(this.devAdminLoginId, "click", () => {
            this.session.value = {
                token: "123",
                userId: 0,
                username: "testadmin",
                role: "Admin",
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
