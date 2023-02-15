import { Context } from "../Context";
import { Component } from "../framework";

export class Supporter implements Component {
    public constructor(
        private context: Context,
    ) { }

    public render() {
        return /*html*/ `
            <h1>Welcome to ticket-system</h1>
            <table id="ticket-table">
                <tr id="ticket-variables">
                    <th id="name">Name</th>
                    <th id="title">Title</th>
                    <th id="status">Status</th>
                    <th id="assigned-to">Assigned To</th>
                </tr>
                <tr id="ticket-row">
                    <td id="name">Lars Andersen</td>
                    <td id="title">Jeg kan ikke finde mine bitcoins</td>
                    <td id="status">Open</td>
                    <td id="assigned-to">1st level</td>
                </tr>
            </table>
        `;
    }

    public hydrate(update: () => void): void {
        if (this.context.session === null) {
            this.context.router.routeTo("/login")
            return update();
        }
    }
}
