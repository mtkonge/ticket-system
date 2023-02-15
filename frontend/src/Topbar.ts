import { Context } from "./Context";
import { Component, domAddEvent, html } from "./framework";
import { generateId } from "./utils";

export class Topbar implements Component {
    private indexButtonId = generateId("index");
    private customerButtonId = generateId("customer");
    private supporterButtonId = generateId("supporter");
    private adminPanelButtonId = generateId("supporter");

    private loginButton = generateId("login");
    private logoutButton = generateId("logout");

    public constructor(
        private context: Context
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
                    ${this.context.session?.role === "Admin" ? html`
                        <button id="${this.adminPanelButtonId}">
                            Admin panel
                        </button>
                    ` : ""}
                    ${this.context.session !== null ? html`
                        <button id="${this.customerButtonId}">
                            My tickets
                        </button>
                    ` : ""}
                    ${this.context.session !== null && this.context.session?.role !== "Consumer" ? html`
                        <button id="${this.supporterButtonId}">
                            Assigned tickets
                        </button>
                    ` : ""}
                    ${this.context.session === null ? html`
                        <button id="${this.loginButton}">
                            Login
                        </button>
                    ` : ""}
                    ${this.context.session !== null ? html`
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
            this.context.router.routeTo("/");
            update();
        });
        if (this.context.session?.role === "Admin") {
            domAddEvent(this.adminPanelButtonId, "click", () => {
                this.context.router.routeTo("/admin_panel");
                update();
            })
        }
        if (this.context.session !== null) {
            domAddEvent(this.customerButtonId, "click", () => {
                this.context.router.routeTo("/customer");
                update();
            });
        }
        if (this.context.session !== null && this.context.session?.role !== "Consumer") {
            domAddEvent(this.supporterButtonId, "click", () => {
                this.context.router.routeTo("/supporter");
                update();
            });
        }
        if (this.context.session === null) {
            domAddEvent(this.loginButton, "click", () => {
                this.context.router.routeTo("/login");
                update();
            });
        }
        if (this.context.session !== null) {
            domAddEvent(this.logoutButton, "click", () => {
                this.context.session = null;
                this.context.router.routeTo("/");
                update();
            });
        }
    }
}
