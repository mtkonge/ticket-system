import { TextInput } from "../TextInput";
import { Component, byRef, html } from "../framework";

export class Index implements Component {

	public render() {
		return html`
			<div class="index">
				<h1>Enterprise TicketSystem</h1>
				<h3>
					"I kan ikke nå at lave et ticket-system fra bunden." - Bjarne 2023
				</h3>
				<img src="https://media.istockphoto.com/photos/business-development-to-success-and-growing-growth-concept-pointing-picture-id1203745988" alt="lars andersen">
			</div>
		`;
	}

	public children() {
		return [];
	}
}
