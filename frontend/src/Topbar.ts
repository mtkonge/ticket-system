import { Component } from "./Component"

export class Topbar implements Component {
	public render() {
		return `
			<div class="topbar">
				<h1>Topbar 1234</h1>
			</div>
		`;
	}
}

