import { ByRef, Component, domAddEvent, html } from "./framework";
import { Session } from "./session";
import { generateId, RouterPath } from "./utils";

export class Topbar implements Component {
    private indexButtonId = generateId("index");
    private customerButtonId = generateId("customer");
    private supporterButtonId = generateId("supporter");

    private loginButton = generateId("login");

    public constructor(private router: RouterPath, private session: ByRef<Session | null>) { }

    public render() {
        return html`
            <div class="topbar">
                <div>
                    <h1>TicketSystem®</h1>
                    <button id="${this.indexButtonId}"><span class="material-symbols-outlined">home</span></button>
                </div>
                <div class="text-buttons">
                    ${(() => {
                if (this.session.value !== null) {
                    return html`
                        <button id="${this.customerButtonId}">I am a customer</button>
                        <button id="${this.supporterButtonId}">I am an it-supporter punjabi no virus</button>
                    `;
                } else {
                    return html`
                        <button id="${this.loginButton}">Login</button>
                    `;
                }
            })()}
                </div>
            </div>
        `;
    }
    public hydrate(update: () => void) {
        domAddEvent(this.indexButtonId, "click", () => {
            this.router.routeTo("/");
            update();
        });
        if (this.session.value !== null) {
            domAddEvent(this.customerButtonId, "click", () => {
                this.router.routeTo("/customer");
                update();
            });
            domAddEvent(this.supporterButtonId, "click", () => {
                this.router.routeTo("/supporter");
                update();
            });
        } else {
            domAddEvent(this.loginButton, "click", () => {
                this.router.routeTo("/login");
                update();
            });
        }
    }
}
