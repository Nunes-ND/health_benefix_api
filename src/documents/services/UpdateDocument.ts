import { Document } from "../entities/Document";
import { DocumentRepository } from "../repositories/Document";

export type UpdateDocumentData = {
	description: string;
};

export type UpdateDocumentRequest = {
	id: string;
	data: UpdateDocumentData;
};

export class UpdateDocument {
	constructor(private readonly documentRepository: DocumentRepository) {}

	async handle({ id, data }: UpdateDocumentRequest): Promise<Document> {
		const document = await this.documentRepository.findById(id);
		if (!document) {
			throw new Error("Document not found.");
		}

		document.updateDescription(data.description);

		const updatedDocument = await this.documentRepository.update(document);
		return updatedDocument;
	}
}
