import { editDocument, KnowledgeDocument, oneDocument } from "../api";
import { Context } from "../Context";
import { Component, domSelectId, fetched, html } from "../framework";
import { generateId } from "../utils";

export class DocumentEditor implements Component {
    private errorMessage = ""
    private knowledgeDocument = fetched<KnowledgeDocument>();
    private documentFormId = generateId();

    public constructor(private context: Context) { }

    public render() {
        return html`
            ${this.errorMessage !== ""
                ? html`<p class="error-text">${this.errorMessage}</p>`
                : ""}
            ${this.knowledgeDocument.isFetched ? html`
                <form id="${this.documentFormId}" class="document">
                    <input type="text" name="title" value="${this.knowledgeDocument.data!.title}" class="title">
                    <br>
                    <textarea name="content" class="content">${this.knowledgeDocument.data!.content}</textarea>
                    <br>
                    <button type="submit" class="brand-button">Save</button>
                </form>
            ` : html`
                <h1>Document editor</h1>
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
            const form = domSelectId<HTMLFormElement>(this.documentFormId);
            form.addEventListener("submit", async (event) => {
                event.preventDefault();
                const data = new FormData(form);
                const response = await editDocument({
                    token: this.context.session!.token,
                    id: this.knowledgeDocument.data!.id,
                    title: data.get("title")!.toString(),
                    content: data.get("content")!.toString(),
                });
                if (!response.ok) {
                    this.errorMessage = response.msg;
                } else {
                    this.context.router.routeTo("/document_reader", `?document=${this.knowledgeDocument.data!.id}`);
                }
                this.context.documentHasChangedAmountSinceLastTime = true
                update();
            });
        }
    }
}
