import { Customer } from "./pages/Customer";
import { Supporter } from "./pages/Supporter";
import { ByRef, Component } from "./framework";
import { Index } from "./pages/Index";
import { RouterPath } from "./utils";
import { Session } from "./session";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AdminPanel } from "./pages/AdminPanel";

export class Router implements Component {
    private indexPage = new Index();
    private customerPage = new Customer();
    private supporterPage = new Supporter();
    private loginPage: Login;
    private registerPage: Register;
    private adminPanelPage: AdminPanel;

    public constructor(
        private routerPath: RouterPath,
        private session: ByRef<Session | null>,
    ) {
        this.loginPage = new Login(this.routerPath, this.session);
        this.registerPage = new Register(this.routerPath, this.session);
        this.adminPanelPage = new AdminPanel(this.routerPath, this.session);
    }

    public render() {
        if (this.routerPath.route() == "/") return this.indexPage.render();
        else if (this.routerPath.route() == "/customer")
            return this.customerPage.render();
        else if (this.routerPath.route() == "/supporter")
            return this.supporterPage.render();
        else if (this.routerPath.route() == "/login")
            return this.loginPage.render();
        else if (this.routerPath.route() == "/register")
            return this.registerPage.render();
        else if (this.routerPath.route() == "/admin_panel")
            return this.adminPanelPage.render();
        return "<img src='https://http.cat/404.jpg'>";
    }

    public children() {
        if (this.routerPath.route() == "/") return [this.indexPage];
        else if (this.routerPath.route() == "/customer")
            return [this.customerPage];
        else if (this.routerPath.route() == "/supporter")
            return [this.supporterPage];
        else if (this.routerPath.route() == "/login") return [this.loginPage];
        else if (this.routerPath.route() == "/register")
            return [this.registerPage];
        else if (this.routerPath.route() == "/admin_panel")
            return [this.adminPanelPage];
        else return [];
    }

    public hydrate(update: () => void) {
        // not using addEventListener to clear previous
        window.onpopstate = () => {
            this.routerPath.updateRouteToUrl();
            update();
        };
    }
}
