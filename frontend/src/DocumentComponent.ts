import { KnowledgeDocumentInfo } from "./api";
import { Component, html } from "./framework";

export class DocumentComponent implements Component {
    public constructor(private document: KnowledgeDocumentInfo) { }

    public render() {
        return html`
            <div id class="knowledge-container">
                <h3 class="knowledge-title">${this.document.title}</h3>
            </div>
        `;
    }
}
