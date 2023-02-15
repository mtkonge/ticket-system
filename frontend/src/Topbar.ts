import { ByRef, Component, domAddEvent, html } from "./framework";
import { Session } from "./session";
import { generateId, Router } from "./utils";

export class Topbar implements Component {
    private indexButtonId = generateId("index");
    private customerButtonId = generateId("customer");
    private supporterButtonId = generateId("supporter");
    private adminPanelButtonId = generateId("supporter");

    private loginButton = generateId("login");
    private logoutButton = generateId("logout");

    public constructor(
        private router: Router,
        private session: ByRef<Session | null>,
    ) { }

    public render() {
        return html`
            <div class="topbar">
                <div>
                    <img src="/favicon.ico" height="36">
                    <h1>TicketSystem®</h1>
                    <button id="${this.indexButtonId}">
                        <span class="material-symbols-outlined">home</span>
                    </button>
                </div>
                <div class="text-buttons">
                    ${this.session.value?.role === "Admin" ? html`
                        <button id="${this.adminPanelButtonId}">
                            Admin panel
                        </button>
                    ` : ""}
                    ${this.session.value !== null ? html`
                        <button id="${this.customerButtonId}">
                            My tickets
                        </button>
                    ` : ""}
                    ${this.session.value !== null && this.session.value?.role !== "Consumer" ? html`
                        <button id="${this.supporterButtonId}">
                            Assigned tickets
                        </button>
                    ` : ""}
                    ${this.session.value === null ? html`
                        <button id="${this.loginButton}">
                            Login
                        </button>
                    ` : ""}
                    ${this.session.value !== null ? html`
                        <button id="${this.logoutButton}">
                            Logout
                        </button>
                    ` : ""}
                </div>
            </div>
        `;
    }
    public hydrate(update: () => void) {
        domAddEvent(this.indexButtonId, "click", () => {
            this.router.routeTo("/");
            update();
        });
        if (this.session.value?.role === "Admin") {
            domAddEvent(this.adminPanelButtonId, "click", () => {
                this.router.routeTo("/admin_panel");
                update();
            })
        }
        if (this.session.value !== null) {
            domAddEvent(this.customerButtonId, "click", () => {
                this.router.routeTo("/customer");
                update();
            });
        }
        if (this.session.value !== null && this.session.value?.role !== "Consumer") {
            domAddEvent(this.supporterButtonId, "click", () => {
                this.router.routeTo("/supporter");
                update();
            });
        }
        if (this.session.value === null) {
            domAddEvent(this.loginButton, "click", () => {
                this.router.routeTo("/login");
                update();
            });
        }
        if (this.session.value !== null) {
            domAddEvent(this.logoutButton, "click", () => {
                this.session.value = null;
                this.router.routeTo("/");
                update();
            });
        }
    }
}
