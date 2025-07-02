import { beforeEach, describe, expect, it, vi } from "vitest";
import { Document, DocumentCategory } from "@/documents/entities/Document";
import { ListDocuments } from "@/documents/services/ListDocuments";
import { MockDocumentRepository } from "../__mocks__/DocumentRepository";

describe("List Documents", () => {
	let documentRepository: MockDocumentRepository;
	let listDocuments: ListDocuments;

	beforeEach(() => {
		documentRepository = new MockDocumentRepository();
		listDocuments = new ListDocuments(documentRepository);
	});

	it("should return a list of all documents", async () => {
		const doc1 = Document.create({
			documentType: DocumentCategory.IDENTIFICATION,
			description: "RG",
		});
		const doc2 = Document.create({
			documentType: DocumentCategory.EXAMS_AND_REPORTS,
			description: "Blood Test",
		});
		await documentRepository.save(doc1);
		await documentRepository.save(doc2);
		const findAllSpy = vi.spyOn(documentRepository, "findAll");

		const documents = await listDocuments.handle();

		expect(findAllSpy).toHaveBeenCalledOnce();
		expect(documents).toHaveLength(2);
		expect(documents[0]).toBeInstanceOf(Document);
		expect(documents).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ description: "RG" }),
				expect.objectContaining({ description: "Blood Test" }),
			]),
		);
	});

	it("should return an empty array if no documents exist", async () => {
		const findAllSpy = vi.spyOn(documentRepository, "findAll");

		const documents = await listDocuments.handle();

		expect(findAllSpy).toHaveBeenCalledOnce();
		expect(documents).toBeInstanceOf(Array);
		expect(documents).toHaveLength(0);
	});
});
