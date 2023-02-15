import { Context } from "./Context";
import { initializeApp } from "./framework";
import { Layout } from "./Layout";
import { Router } from "./utils";

let context: Context = {
    router: new Router(),
    session: null,
    currentTicketEdit: null,
};

initializeApp(new Layout(context));
