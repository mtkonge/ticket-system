import { TextInput } from "../TextInput";
import { Component } from "../Component";
import { byRef } from "../utils";

export class Index implements Component {
	private state = byRef("test");
	private textInput = new TextInput(this.state);

	public render() {
		return /*html*/`
			<h1>${this.state.value}</h1>
			${this.textInput.render()}
		`;
	}

	public children() {
		return [this.textInput];
	}
}
