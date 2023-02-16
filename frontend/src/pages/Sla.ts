import { Component, domSelectId, html } from "../framework";
import { Context } from "../Context";
import { sla } from "../api";
import { generateId } from "../utils";

export class Sla implements Component {

    private errorId = generateId();
    private titleId = generateId();
    private documentId = generateId();

    public constructor(
        private context: Context,
    ) { }

    public render() {
        return html`
            <span class="error-text" id="${this.errorId}"></span>
            <h1 id="${this.titleId}"></h1>
            <div class="document" id="${this.documentId}">
                Loading...
            </div>
        `;
    }

    public hydrate(update: () => void) {
        sla().then(response => {
            if (!response.ok) {
                domSelectId(this.documentId).innerText = "";
                domSelectId(this.errorId).innerText = response.msg;
                return;
            }

            domSelectId(this.documentId).innerText = response.document.content;
            domSelectId(this.titleId).innerText = response.document.title;
        });

    }

}
