import { allDocuments, KnowledgeDocument } from "../api";
import { Context } from "../Context";
import { Component, domAddEvent, fetched, html } from "../framework";

export class Knowledge implements Component {
    public constructor(private context: Context) {}
    private documents = fetched<KnowledgeDocument[]>();
    private errorMessage = "";

    public render() {
        return html`
            <h1>Knowledge</h1>
            ${this.errorMessage !== ""
                ? html`<p class="error-text">${this.errorMessage}</p>`
                : ""}
            <div id="knowledge-container">
                <h3 class="knowledge-title">Lars Andersen</h3>
                <h3 class="knowledge-title">Lars Kragh Andersen</h3>
                <h3 class="knowledge-title">Lorem ipsum dolor sit amet</h3>
            </div>
        `;
    }

    public hydrate(update: () => void): void {
        if (this.context.session === null) {
            this.context.router.routeTo("/login");
            return update();
        }
        if (!this.documents.isFetched) {
            allDocuments({ token: this.context.session.token }).then(
                (response) => {
                    if (!response.ok) {
                        this.errorMessage = response.msg;
                    } else {
                        this.documents.data = response.documents;
                    }
                    this.documents.isFetched = true;
                    update();
                },
            );
        }
        // if (this.documents.isFetched) {
        //     this.documents.data!.forEach((document, i) => {
        //         domAddEvent<HTMLTableRowElement, "click">(
        //             "random" + i,
        //             "click",
        //             () => {
        //                 this.context.currentDocumentEdit = document;
        //                 this.documents.isFetched = false;
        //                 this.context.router.routeTo("/ticket_editor");
        //                 update();
        //             },
        //         );
        //     });
        // }
    }
}
