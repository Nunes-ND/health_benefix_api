import { beforeEach, describe, expect, it } from "vitest";
import { Document, DocumentCategory } from "@/documents/entities/Document";
import { RemoveDocument } from "@/documents/services/RemoveDocument";
import { MockDocumentRepository } from "../__mocks__/DocumentRepository";

let documentRepository: MockDocumentRepository;
let removeDocument: RemoveDocument;

describe("RemoveDocument", () => {
	beforeEach(() => {
		documentRepository = new MockDocumentRepository();
		removeDocument = new RemoveDocument(documentRepository);
	});

	it("should remove a document if it exists", async () => {
		const document = Document.create({
			documentType: DocumentCategory.IDENTIFICATION,
			description: "A document to be removed",
		});
		await documentRepository.save(document);

		await removeDocument.handle(document.id);

		const removedDoc = await documentRepository.findById(document.id);
		expect(removedDoc).toBeNull();
	});

	it("should throw an error if document is not found", async () => {
		const nonExistentId = "non-existent-id";

		await expect(removeDocument.handle(nonExistentId)).rejects.toThrow(
			"Document not found.",
		);
	});
});
