import { Customer } from "./pages/Customer";
import { Supporter } from "./pages/Supporter";
import { Component } from "./framework";
import { Index } from "./pages/Index";
import { RouterPath } from "./utils";

export class Router implements Component {
    private indexPage = new Index();
    private customerPage = new Customer();
    private supporterPage = new Supporter();

    public constructor(
        private routerPath: RouterPath,
    ) { }

    public render() {
        if (this.routerPath.route() == "/") return this.indexPage.render();
        else if (this.routerPath.route() == "/customer")
            return this.customerPage.render();
        else if (this.routerPath.route() == "/supporter")
            return this.supporterPage.render();
        return "<img src='https://http.cat/404.jpg'>";
    }

    public children() {
        if (this.routerPath.route() == "/")
            return [this.indexPage];
        else if (this.routerPath.route() == "/customer")
            return [this.customerPage];
        else if (this.routerPath.route() == "/supporter")
            return [this.supporterPage];
        else return [];
    }
}
