import { DocumentRepository } from "../repositories/Document";

export class ListDocuments {
	constructor(private readonly documentRepository: DocumentRepository) {}

	async handle() {
		const documents = await this.documentRepository.findAll();
		return documents;
	}
}
