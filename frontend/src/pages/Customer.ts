import { Component } from "../Component";

export class Customer implements Component {
    public render() {
        return /*html*/ `
		<h1>Welcome to ticket-system</h1>
		<table id="ticket-table">
			<tr id="ticket-variables">
				<th id="title">Title</th>
				<th id="status">Status</th>
				<th id="assigned-to">Assigned To</th>
			</tr>
			<tr id="ticket-row">
				<td id="title">Jeg kan ikke finde mine bitcoins</td>
				<td id="status">Open</td>
				<td id="assigned-to">1st level</td>
			</tr>
		</table>
		`;
    }
}
