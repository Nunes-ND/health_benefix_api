import { DocumentRepository } from "../repositories/Document";

export class RemoveDocument {
	constructor(private readonly documentRepository: DocumentRepository) {}

	async handle(id: string): Promise<void> {
		const document = await this.documentRepository.findById(id);

		if (!document) {
			throw new Error("Document not found.");
		}

		await this.documentRepository.remove(document);
	}
}
