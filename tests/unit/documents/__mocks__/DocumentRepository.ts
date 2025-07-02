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

	findById(id: string): Promise<Document | null> {
		const docData = this.documents.get(id);
		if (!docData) {
			return Promise.resolve(null);
		}
		const doc = Document.create(
			{ documentType: docData.documentType, description: docData.description },
			{
				id: docData.id,
				createdAt: docData.createdAt,
				updatedAt: docData.updatedAt,
			},
		);
		return Promise.resolve(doc);
	}

	update(document: Document): Promise<Document> {
		if (!this.documents.has(document.id)) {
			throw new Error("Document not found in mock for update");
		}
		this.documents.set(document.id, { ...document });
		return Promise.resolve(document);
	}

	remove(document: Document): Promise<void> {
		if (!this.documents.has(document.id)) {
			throw new Error("Document not found in mock for remove");
		}
		this.documents.delete(document.id);
		return Promise.resolve();
	}
}
