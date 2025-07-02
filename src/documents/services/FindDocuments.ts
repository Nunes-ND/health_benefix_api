import { Document, DocumentData } from "../entities/Document";
import { DocumentRepository } from "../repositories/Document";

export class FindDocuments {
	constructor(private readonly documentRepository: DocumentRepository) {}

	async handle(
		criteria: Partial<{ id: string } & DocumentData>,
	): Promise<Document[]> {
		const documentsFound = await this.documentRepository.find(criteria);
		return documentsFound;
	}
}
