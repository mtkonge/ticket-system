import { Context } from "./Context";
import { initiaizeApp } from "./framework";
import { Layout } from "./Layout";
import { Router } from "./utils";

let context: Context = {
    router: new Router(),
    session: null,
    currentTicketEdit: null,
}

initiaizeApp(new Layout(context));


