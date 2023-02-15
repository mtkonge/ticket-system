import { Context } from "../Context";
import { Component, html } from "../framework";

export class Index implements Component {

    public constructor(
        private context: Context,
    ) { }

    public render() {
        return html`
            <div id="frontpage-background"></div>
            <div class="index" style="">
                <h1>Enterprise TicketSystem&reg;</h1>
                <h3>"I kan ikke nå at lave et ticket-system fra bunden." - Bjarne 2023</h3>
            </div>
            <img id='trustpilot' src='https://knowledgehub.makemyblinds.co.uk/hubfs/yes.png' height='100'>
        `;
    }

    public children() {
        return [];
    }
}
