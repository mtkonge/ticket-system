import { Component } from "./Component"
import { Router } from "./Router";
import { Topbar } from "./Topbar";

export class Layout implements Component {
	private topbar = new Topbar();
	private router = new Router();

	public children() { return [this.topbar, this.router]; }

	public render() {
		return `
			${this.topbar.render()}
			<main>
				${this.router.render()}
			</main>
		`;
	}
}

