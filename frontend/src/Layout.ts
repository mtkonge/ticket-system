import { Component } from "./Component"
import { Router } from "./Router";
import { Topbar } from "./Topbar";
import { RouterPath } from "./utils";

export class Layout implements Component {
	private routerPath = new RouterPath();
	private router = new Router(this.routerPath);
	private topbar = new Topbar(this.routerPath);

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

