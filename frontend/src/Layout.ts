import { Component, ByRef } from "./framework"
import { RouterPage } from "./Router";
import { Session } from "./session";
import { Topbar } from "./Topbar";
import { Router } from "./utils";

export class Layout implements Component {
    private routerPath = new Router();
    private router: RouterPage;
    private topbar: Topbar;
    public constructor(
        private session: ByRef<Session | null>,
    ) {
        this.router = new RouterPage(this.routerPath, this.session);
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
                Copyright © 2023 Gruppe 2
            </footer>
        `;
    }
}

