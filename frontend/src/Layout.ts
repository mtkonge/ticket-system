import { Component } from "./Component"
import { Router } from "./Router";
import { Topbar } from "./Topbar";

export class Layout implements Component {
	private router = new Router();
	private topbar = new Topbar(this.router);

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

