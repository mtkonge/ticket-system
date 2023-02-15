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
import { TicketEditor } from "./pages/TicketEditor";
import { Context } from "./Context";

export class RouterPage implements Component {
    private indexPage = new Index();
    private customerPage;
    private supporterPage = new Supporter();
    private loginPage: Login;
    private registerPage: Register;
    private adminPanelPage: AdminPanel;
    private createTicketPage: CreateTicket;
    private ticketEditorPage: TicketEditor;

    public constructor(
        private context: Context,
    ) {
        this.customerPage = new Customer(this.context);
        this.loginPage = new Login(this.context);
        this.registerPage = new Register(this.context);
        this.adminPanelPage = new AdminPanel(this.context);
        this.createTicketPage = new CreateTicket(this.context);
        this.ticketEditorPage = new TicketEditor(this.context);
    }

    public render() {
        if (this.context.router.route() == "/") return this.indexPage.render();
        else if (this.context.router.route() == "/customer")
            return this.customerPage.render();
        else if (this.context.router.route() == "/supporter")
            return this.supporterPage.render();
        else if (this.context.router.route() == "/login")
            return this.loginPage.render();
        else if (this.context.router.route() == "/register")
            return this.registerPage.render();
        else if (this.context.router.route() == "/admin_panel")
            return this.adminPanelPage.render();
        else if (this.context.router.route() == "/create_ticket")
            return this.createTicketPage.render();
        else if (this.context.router.route() == "/ticket_editor")
            return this.ticketEditorPage.render();
        return "<img src='https://http.cat/404.jpg'>";
    }

    public children() {
        if (this.context.router.route() == "/") return [this.indexPage];
        else if (this.context.router.route() == "/customer")
            return [this.customerPage];
        else if (this.context.router.route() == "/supporter")
            return [this.supporterPage];
        else if (this.context.router.route() == "/login") return [this.loginPage];
        else if (this.context.router.route() == "/register")
            return [this.registerPage];
        else if (this.context.router.route() == "/admin_panel")
            return [this.adminPanelPage];
        else if (this.context.router.route() == "/create_ticket")
            return [this.createTicketPage];
        else if (this.context.router.route() == "/ticket_editor")
            return [this.ticketEditorPage];
        else return [];
    }

    public hydrate(update: () => void) {
        // not using addEventListener to clear previous
        window.onpopstate = () => {
            this.context.router.updateRouteToUrl();
            update();
        };
    }
}
