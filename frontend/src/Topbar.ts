import { Context } from "./Context";
import { Component, domAddEvent, html } from "./framework";
import { generateId } from "./utils";

export class Topbar implements Component {
    private indexButtonId = generateId("index");
    private customerButtonId = generateId("customer");
    private supporterButtonId = generateId("supporter");
    private adminPanelButtonId = generateId("supporter");
    private knowledgeButtonId = generateId();

    private loginButton = generateId("login");
    private logoutButton = generateId("logout");

    private slaButton = generateId("sla");
    private serviceCatalogButton = generateId("service-catalog");

    public constructor(
        private context: Context
    ) { }

    public render() {
        return html`
            <div class="topbar">
                <div>
                    <img src="/favicon.ico">
                    <button id="${this.indexButtonId}" class="brand-name">TicketSystem®</h1>
                </div>
                <div class="text-buttons">
                    <button id="${this.slaButton}">
                        SLA
                    </button>
                    <button id="${this.serviceCatalogButton}">
                        Service Catalog
                    </button>
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
                    ${this.context.session !== null && this.context.session?.role !== "Consumer" ? html`
                        <button id="${this.knowledgeButtonId}">
                            Knowledge
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
        if (this.context.session !== null && this.context.session?.role !== "Consumer") {
            domAddEvent(this.knowledgeButtonId, "click", () => {
                this.context.router.routeTo("/knowledge");
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

        domAddEvent(this.slaButton, "click", () => {
            this.context.router.routeTo("/sla");
            update();
        });

        domAddEvent(this.serviceCatalogButton, "click", () => {
            this.context.router.routeTo("/service-catalog");
            update();
        });
    }
}
