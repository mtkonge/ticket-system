import { Component } from "./Component";
import { ByRef, domSelectId, generateId } from "./utils";

export class TextInput implements Component {
	private buttonId = generateId("button");
	private inputId = generateId("input");

	public constructor(private value: ByRef<string>) { }

	public render() {
		return `
			<input id="${this.inputId}">
			<button id="${this.buttonId}">hello</button>
		`;
	}

	public hydrate(update: () => void) {
		domSelectId(this.buttonId).addEventListener("click", () => {
			this.value.value = domSelectId<HTMLInputElement>(this.inputId).value;
			update();
		});
	}
}
