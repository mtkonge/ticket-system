import { Context } from "vm";
import { Component, fetched, html } from "../framework";
import { generateId } from "../utils";

export class DocumentCreator implements Component {
    public constructor(private context: Context) {}
    private formId = generateId("form");
    private errorMessage = "";

    public render() {
        return html`
            <h1>Create Document</h1>
            ${this.errorMessage !== ""
                ? html`<p class="error-text">${this.errorMessage}</p>`
                : ""}
            <form id="${this.formId}">
                <input placeholder="Title" name="title" />
                <br />
                <textarea placeholder="Content" name="content"></textarea>
                <br />
                <input type="submit" value="Create" />
            </form>
        `;
    }

    public hydrate(update: () => void): void {}
}
