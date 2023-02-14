import { Component } from "./Component";
import { Router } from "./Router";
import { domSelectId, generateId } from "./utils";

export class Topbar implements Component {
    private indexButtonId = generateId("index");
    private customerButtonId = generateId("customer");
    private supporterButtonId = generateId("supporter");

    public constructor(private router: Router) {}

    public render() {
        return /*html*/ `
			<div class="topbar">
				<button id="${this.indexButtonId}"><span class="material-symbols-outlined">home</span></button>
				<button id="${this.customerButtonId}">I am a customer</button>
				<button id="${this.supporterButtonId}">I am an it-supporter punjabi no virus</button>
			</div>
		`;
    }
    public hydrate(update: () => void) {
        domSelectId(this.customerButtonId).addEventListener("click", () => {
            this.router.redirect("customer");
            update();
        });
        domSelectId(this.supporterButtonId).addEventListener("click", () => {
            this.router.redirect("supporter");
            update();
        });
        domSelectId(this.indexButtonId).addEventListener("click", () => {
            this.router.redirect("index");
            update();
        });
    }
}
