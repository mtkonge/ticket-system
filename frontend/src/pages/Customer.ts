import { Component } from "../Component";

export class Customer implements Component {
    public render() {
        return /*html*/ `
		<h1>Welcome to ticket-system</h1>
		<div id="tickets">
			<div id="ticket-row">
				<div id="name">Name</div>
				<div id="title">Title</div>
				<div id="status">Status</div>
				<div id="assigned-to">Assigned To</div>
			</div>
		</div>
		`;
    }
}
