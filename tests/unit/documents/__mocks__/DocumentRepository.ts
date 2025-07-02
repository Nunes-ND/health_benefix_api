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
			(doc) =>
				doc.documentType === document.documentType &&
				doc.description === document.description,
		);
		return Promise.resolve(alreadyExists);
	}

	save(document: Document): Promise<Document> {
		this.documents.set(document.id, { ...document });
		return Promise.resolve(document);
	}

	findById(id: string): Promise<Document | null> {
		const docData = this.documents.get(id);
		if (!docData) {
			return Promise.resolve(null);
		}
		return Promise.resolve(this.mapDataToDocument(docData));
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

	findAll(): Promise<Document[]> {
		return Promise.resolve(
			Array.from(this.documents.values()).map((docData) =>
				this.mapDataToDocument(docData),
			),
		);
	}

	find(criteria: Partial<{ id: string } & DocumentData>): Promise<Document[]> {
		if (Object.keys(criteria).length === 0) {
			return this.findAll();
		}

		const allDocs = Array.from(this.documents.values());

		const filteredDocs = allDocs.filter(
			(doc) =>
				(!criteria.id || doc.id === criteria.id) &&
				(!criteria.documentType ||
					doc.documentType === criteria.documentType) &&
				(!criteria.description ||
					doc.description
						.toLowerCase()
						.includes(criteria.description.toLowerCase())),
		);

		return Promise.resolve(
			filteredDocs.map((docData) => this.mapDataToDocument(docData)),
		);
	}

	private mapDataToDocument(data: DocumentData & DocumentProps): Document {
		return Document.create(
			{ documentType: data.documentType, description: data.description },
			{ id: data.id, createdAt: data.createdAt, updatedAt: data.updatedAt },
		);
	}
}
