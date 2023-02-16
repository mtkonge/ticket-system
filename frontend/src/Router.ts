import { Customer } from "./pages/Customer";
import { Supporter } from "./pages/Supporter";
import { Component } from "./framework";
import { Index } from "./pages/Index";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AdminPanel } from "./pages/AdminPanel";
import { CreateTicket } from "./pages/CreateTicket";
import { TicketEditor } from "./pages/TicketEditor";
import { Context } from "./Context";
import { DocumentReader } from "./pages/DocumentReader";
import { DocumentEditor } from "./pages/DocumentEditor";
import { Knowledge } from "./pages/Knowledge";
import { DocumentCreator } from "./pages/CreateDocument";

export class RouterPage implements Component {
    private indexPage = new Index(this.context);
    private customerPage = new Customer(this.context);
    private supporterPage = new Supporter(this.context);
    private loginPage = new Login(this.context);
    private registerPage = new Register(this.context);
    private adminPanelPage = new AdminPanel(this.context);
    private createTicketPage = new CreateTicket(this.context);
    private ticketEditorPage = new TicketEditor(this.context);
    private knowledgePage = new Knowledge(this.context);
    private documentReaderPage = new DocumentReader(this.context);
    private documentEditorPage = new DocumentEditor(this.context);
    private documentCreatorPage = new DocumentCreator(this.context);

    public constructor(private context: Context) {}

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
        else if (this.context.router.route() == "/document_reader")
            return this.documentReaderPage.render();
        else if (this.context.router.route() == "/knowledge")
            return this.knowledgePage.render();
        else if (this.context.router.route() == "/document_editor")
            return this.documentEditorPage.render();
        else if (this.context.router.route() == "/document_creator")
            return this.documentCreatorPage.render();
        return "<img src='https://http.cat/404.jpg'>";
    }

    public children() {
        if (this.context.router.route() == "/") return [this.indexPage];
        else if (this.context.router.route() == "/customer")
            return [this.customerPage];
        else if (this.context.router.route() == "/supporter")
            return [this.supporterPage];
        else if (this.context.router.route() == "/login")
            return [this.loginPage];
        else if (this.context.router.route() == "/register")
            return [this.registerPage];
        else if (this.context.router.route() == "/admin_panel")
            return [this.adminPanelPage];
        else if (this.context.router.route() == "/create_ticket")
            return [this.createTicketPage];
        else if (this.context.router.route() == "/ticket_editor")
            return [this.ticketEditorPage];
        else if (this.context.router.route() == "/knowledge")
            return [this.knowledgePage];
        else if (this.context.router.route() == "/document_reader")
            return [this.documentReaderPage];
        else if (this.context.router.route() == "/document_editor")
            return [this.documentEditorPage];
        else if (this.context.router.route() == "/document_creator")
            return [this.documentCreatorPage];
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
