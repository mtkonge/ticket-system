import { Customer } from "./pages/Customer";
import { Supporter } from "./pages/Supporter";
import { Component } from "./Component";
import { Index } from "./pages/Index";
import { byRef } from "./utils";

export class Router implements Component {
    private route = byRef("index");
    private indexPage = new Index();
    private customerPage = new Customer();
    private supporterPage = new Supporter();

    public render() {
        if (this.route.value == "index") return this.indexPage.render();
        else if (this.route.value == "customer")
            return this.customerPage.render();
        else if (this.route.value == "supporter")
            return this.supporterPage.render();
        return "<img src='https://http.cat/404.jpg'>";
    }

    public redirect(route: string) {
        this.route.value = route;
        this.render();
    }

    public children() {
        return [this.indexPage, this.customerPage, this.supporterPage];
    }
}
