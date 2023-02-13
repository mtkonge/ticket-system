import { TextInput } from "../TextInput";
import { Component } from "../Component";

export class Index extends Component {

	private state = { value: "test" };
	private textInput = new TextInput(this.state);

	render() {
		return /*html*/`
			<h1>${this.state.value}</h1>
			${this.textInput.render()}
		`;
	}

	children() {
		return [ this.textInput ];
	}

}
