import { Context } from "../Context";
import { Component, html } from "../framework";

export class DocumentEditor implements Component {
    public constructor(private context: Context) {}

    public render() {
        return html` <h1>Document editor</h1> `;
    }
}
