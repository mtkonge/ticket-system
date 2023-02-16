import { Context } from "vm";
import { Component, html } from "../framework"

export class Knowledge implements Component {
    public constructor(
        private context: Context,
    ) { }

    public render() {
        return html`
            <h1>Knowledge</h1>
        `;
    }
}


