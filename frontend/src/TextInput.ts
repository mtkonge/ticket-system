import { Component } from "./Component";
import { generateId } from "./generateId";

export class TextInput implements Component {

	private buttonId = generateId();
	private inputId = generateId();

	constructor(private state: { value: string }) {
	}

	render() {
		return `<input id="${this.inputId}"><button id="${this.buttonId}">hello</button>`;
	}

	hydrate(update: () => void) {
		document.getElementById(this.buttonId)!.addEventListener("click", (_event) => {
			this.state.value = document.querySelector<HTMLInputElement>("#" + this.inputId)!.value;
			update();
		});
	}
}
