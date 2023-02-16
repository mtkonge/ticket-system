import { Context } from "../Context";
import { Component, html } from "../framework";

export class DocumentReader implements Component {
    public constructor(private context: Context) {}

    public render() {
        return html` <h1>Document reader</h1> `;
    }
}
