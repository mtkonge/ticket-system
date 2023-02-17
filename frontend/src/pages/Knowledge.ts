import { allDocuments, KnowledgeDocumentInfo } from "../api";
import { Context } from "../Context";
import { DocumentComponent } from "../DocumentComponent";
import { Component, domAddEvent, fetched, html } from "../framework";

export class Knowledge implements Component {
    public constructor(private context: Context) { }
    private documents = fetched<KnowledgeDocumentInfo[]>();
    private errorMessage = "";

    public render() {
        return html`
            <h1 id="knowledge-headtitle">Knowledge</h1>
            <button id="create-document" class="brand-button">Create Document</button>
            ${this.errorMessage !== ""
                ? html`<p class="error-text">${this.errorMessage}</p>`
                : ""}

            <div id="knowledges-container">
                ${this.documents.isFetched
                ? this.documents
                    .data!.map(
                        (document, i) => html`
                                  <div
                                      id="document${i}"
                                      class="knowledge-container"
                                        tabindex="0"
                                  >
                                    <h3 class="knowledge-title">${document.title}</h3>
                                    <code>#${document.id}</code>
                                </div>
                              `,
                    )
                    .join("")
                : ""}
            </div>
        `;
    }

    public hydrate(update: () => void): void {
        if (this.context.session === null) {
            this.context.router.routeTo("/login");
            return update();
        }
        if (
            !this.documents.isFetched ||
            this.context.documentHasChangedAmountSinceLastTime
        ) {
            allDocuments({ token: this.context.session.token }).then(
                (response) => {
                    if (!response.ok) {
                        this.errorMessage = response.msg;
                    } else {
                        this.documents.data = response.documents;
                    }
                    this.documents.isFetched = true;
                    this.context.documentHasChangedAmountSinceLastTime = false;
                    this.showDocuments();
                    update();
                },
            );
        }
        domAddEvent("create-document", "click", () => {
            this.context.router.routeTo("/document_creator");
            update();
        });
        if (this.documents.isFetched) {
            this.documents.data!.forEach((doc, i) => {
                domAddEvent(`document${i}`, "click", () => {
                    this.context.router.routeTo("/document_reader", `?document=${doc.id}`);
                    update();
                })
            });
        }
    }

    private showDocuments() {
        if (this.documents.isFetched) {
            this.documents.data!.map(
                (document) => new DocumentComponent(document),
            );
        }
    }
}
