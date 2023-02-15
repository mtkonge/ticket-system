import { Customer } from "./pages/Customer";
import { Supporter } from "./pages/Supporter";
import { ByRef, Component } from "./framework";
import { Index } from "./pages/Index";
import { Router } from "./utils";
import { Session } from "./session";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AdminPanel } from "./pages/AdminPanel";
import { CreateTicket } from "./pages/CreateTicket";

export class RouterPage implements Component {
    private indexPage = new Index();
    private customerPage;
    private supporterPage = new Supporter();
    private loginPage: Login;
    private registerPage: Register;
    private adminPanelPage: AdminPanel;
    private createTicketPage: CreateTicket;

    public constructor(
        private router: Router,
        private session: ByRef<Session | null>,
    ) {
        this.customerPage = new Customer(this.router);
        this.loginPage = new Login(this.router, this.session);
        this.registerPage = new Register(this.router, this.session);
        this.adminPanelPage = new AdminPanel(this.router, this.session);
        this.createTicketPage = new CreateTicket(this.router, this.session);
    }

    public render() {
        if (this.router.route() == "/") return this.indexPage.render();
        else if (this.router.route() == "/customer")
            return this.customerPage.render();
        else if (this.router.route() == "/supporter")
            return this.supporterPage.render();
        else if (this.router.route() == "/login")
            return this.loginPage.render();
        else if (this.router.route() == "/register")
            return this.registerPage.render();
        else if (this.router.route() == "/admin_panel")
            return this.adminPanelPage.render();
        else if (this.router.route() == "/create_ticket")
            return this.createTicketPage.render();
        return "<img src='https://http.cat/404.jpg'>";
    }

    public children() {
        if (this.router.route() == "/") return [this.indexPage];
        else if (this.router.route() == "/customer")
            return [this.customerPage];
        else if (this.router.route() == "/supporter")
            return [this.supporterPage];
        else if (this.router.route() == "/login") return [this.loginPage];
        else if (this.router.route() == "/register")
            return [this.registerPage];
        else if (this.router.route() == "/admin_panel")
            return [this.adminPanelPage];
        else if (this.router.route() == "/create_ticket")
            return [this.createTicketPage];
        else return [];
    }

    public hydrate(update: () => void) {
        // not using addEventListener to clear previous
        window.onpopstate = () => {
            this.router.updateRouteToUrl();
            update();
        };
    }
}
