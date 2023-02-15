import { Component, ByRef } from "./framework"
import { Router } from "./Router";
import { Session } from "./session";
import { Topbar } from "./Topbar";
import { RouterPath } from "./utils";

export class Layout implements Component {
	private routerPath = new RouterPath();
	private router: Router;
	private topbar: Topbar;
	public constructor(
		private session: ByRef<Session | null>,
	) {
		this.router = new Router(this.routerPath, this.session);
		this.topbar = new Topbar(this.routerPath, this.session);
	}

	public children() { return [this.topbar, this.router]; }

	public render() {
		return `
			${this.topbar.render()}
			<main>
				${this.router.render()}
			</main>
			<footer>
				<p>Copyright © 2023 Gruppe 2</p>
			</footer>
		`;
	}
}

