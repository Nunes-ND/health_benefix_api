import { Document, DocumentData } from "@/documents/entities/Document";
import { DocumentRepository } from "@/documents/repositories/Document";

export class CreateDocument {
	constructor(private readonly documentRepository: DocumentRepository) {}

	async handle(data: DocumentData): Promise<Document> {
		const document = Document.create(data);

		const documentExists = await this.documentRepository.exists(document);
		if (documentExists) {
			throw new Error("Document already exists.");
		}

		await this.documentRepository.save(document);

		return document;
	}
}
