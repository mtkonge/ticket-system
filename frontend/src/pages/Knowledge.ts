import { allDocuments, KnowledgeDocument } from "../api";
import { Context } from "../Context";
import { DocumentComponent } from "../DocumentComponent";
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
            <div id="knowledges-container">
                ${this.documents.isFetched
                    ? this.documents
                          .data!.map(
                              (document, i) => html`
                                  <div
                                      id="document${i}"
                                      class="knowledge-container"
                                  >
                                      <h3 class="knowledge-title">
                                          ${document.title}
                                      </h3>
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
        if (!this.documents.isFetched) {
            allDocuments({ token: this.context.session.token }).then(
                (response) => {
                    if (!response.ok) {
                        this.errorMessage = response.msg;
                    } else {
                        this.documents.data = response.documents;
                    }
                    this.documents.isFetched = true;
                    this.showDocuments();
                    update();
                },
            );
        }
        if (this.documents.isFetched) {
            this.documents.data!.forEach((document, i) => {
                domAddEvent<HTMLTableRowElement, "click">(
                    "random" + i,
                    "click",
                    () => {
                        this.documents.isFetched = false;
                        this.context.router.routeTo(
                            "/document_reader",
                            `?document=${document.id}`,
                        );
                        update();
                    },
                );
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
