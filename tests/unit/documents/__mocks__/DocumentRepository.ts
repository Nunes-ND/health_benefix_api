import {
	Document,
	DocumentData,
	DocumentProps,
} from "@/documents/entities/Document";
import { DocumentRepository } from "@/documents/repositories/Document";

export class MockDocumentRepository extends DocumentRepository {
	documents: Map<string, DocumentData & DocumentProps> = new Map();

	exists(document: Document): Promise<boolean> {
		const alreadyExists = [...this.documents.values()].some(
			(doc) => doc.description === document.description,
		);
		Array.from(this.documents.values()).some(
			(currentDocument) =>
				currentDocument.documentType === document.documentType &&
				currentDocument.description === document.description,
		);
		return new Promise((resolve) => resolve(alreadyExists));
	}

	save(document: Document): Promise<Document> {
		const { id, createdAt, updatedAt } = document;
		const { documentType, description } = document;
		this.documents.set(id, { ...document });
		const doc = Document.create(
			{ documentType, description },
			{ id, createdAt, updatedAt },
		);
		return new Promise((resolve) => resolve(doc));
	}
}
