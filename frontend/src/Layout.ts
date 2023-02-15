import { Context } from "./Context";
import { Component } from "./framework"
import { RouterPage } from "./Router";
import { Topbar } from "./Topbar";

export class Layout implements Component {
    private routerPage: RouterPage;
    private topbar: Topbar;
    public constructor(
        private context: Context,
    ) {
        this.routerPage = new RouterPage(this.context);
        this.topbar = new Topbar(this.context);
    }

    public children() { return [this.topbar, this.routerPage]; }

    public render() {
        return `
            ${this.topbar.render()}
            <main>
                ${this.routerPage.render()}
            </main>
            <footer>
                Copyright © 2023 Gruppe 2
            </footer>
        `;
    }
}

