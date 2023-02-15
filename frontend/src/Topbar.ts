import { ByRef, Component, domAddEvent, html } from "./framework";
import { Session } from "./session";
import { generateId, RouterPath } from "./utils";

export class Topbar implements Component {
    private indexButtonId = generateId("index");
    private customerButtonId = generateId("customer");
    private supporterButtonId = generateId("supporter");

    public constructor(private router: RouterPath, private session: ByRef<Session | null>) { }

    public render() {
        return html`
            <div class="topbar">
                <div>
                    <h1>TicketSystem®</h1>
                    <button id="${this.indexButtonId}"><span class="material-symbols-outlined">home</span></button>
                </div>
                <div>
                    <button id="${this.customerButtonId}">I am a customer</button>
                    <button id="${this.supporterButtonId}">I am an it-supporter punjabi no virus</button>
                </div>
            </div>
        `;
    }
    public hydrate(update: () => void) {
        domAddEvent(this.indexButtonId, "click", () => {
            this.router.routeTo("/");
            update();
        });
        domAddEvent(this.customerButtonId, "click", () => {
            this.router.routeTo("/customer");
            update();
        });
        domAddEvent(this.supporterButtonId, "click", () => {
            this.router.routeTo("/supporter");
            update();
        });
    }
}
