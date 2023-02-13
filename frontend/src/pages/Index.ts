import { TextInput } from "../TextInput";
import { Component } from "../Component";

export class Index implements Component {
	private state = { value: "test" };
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
