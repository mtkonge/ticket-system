import { KnowledgeDocument, oneDocument } from "../api";
import { Context } from "../Context";
import { Component, domAddEvent, fetched, html } from "../framework";
import { generateId } from "../utils";

export class DocumentReader implements Component {
    private errorMessage = ""
    private knowledgeDocument = fetched<KnowledgeDocument>();
    private editDocumentId = generateId();

    public constructor(private context: Context) { }

    public render() {
        return html`
            ${this.errorMessage !== ""
                ? html`<p class="error-text">${this.errorMessage}</p>`
                : ""}
            ${this.knowledgeDocument.isFetched ? html`
                <button class="brand-button" id="${this.editDocumentId}">Edit document</button>
                <h1>${this.knowledgeDocument.data!.title}</h1>
                ${this.knowledgeDocument.data!.content}
            ` : html`
                <h1>Document reader</h1>
                <p>Loading document...</p>
            `}
        `;
    }

    public hydrate(update: () => void): void {
        this.errorMessage = "";
        const searchParams = new URLSearchParams(location.search);
        const maybeDocumentId = searchParams.get("document");
        if (maybeDocumentId === null) {
            this.context.router.routeTo("/");
            return update();
        } else if (this.context.session === null || this.context.session!.role === "Consumer") {
            this.context.router.routeTo("/login");
            return update();
        }
        const documentId = parseInt(maybeDocumentId);
        if (this.knowledgeDocument.data?.id !== documentId) {
            this.knowledgeDocument.isFetched = false;
        }
        if (!this.knowledgeDocument.isFetched) {
            oneDocument({
                token: this.context.session!.token,
                document_id: documentId,
            }).then((response) => {
                if (!response.ok) {
                    this.errorMessage = response.msg;
                } else {
                    this.knowledgeDocument.data = response.document;
                }
                this.knowledgeDocument.isFetched = true;
                update();
            })
        } else {
            domAddEvent(this.editDocumentId, "click", () => {
                this.context.router.routeTo("/document_editor", `?document=${this.knowledgeDocument.data!.id}`);
                update();
            })
        }
    }
}
