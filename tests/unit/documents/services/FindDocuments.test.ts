import { beforeEach, describe, expect, it, vi } from "vitest";
import { Document, DocumentCategory } from "@/documents/entities/Document";
import { FindDocuments } from "@/documents/services/FindDocuments";
import { MockDocumentRepository } from "../__mocks__/DocumentRepository";

describe("Find Documents", () => {
	let documentRepository: MockDocumentRepository;
	let findDocuments: FindDocuments;
	let doc1: Document;
	let doc2: Document;

	beforeEach(async () => {
		documentRepository = new MockDocumentRepository();
		findDocuments = new FindDocuments(documentRepository);
		doc1 = Document.create({
			documentType: DocumentCategory.IDENTIFICATION,
			description: "RG - 123456",
		});
		doc2 = Document.create({
			documentType: DocumentCategory.EXAMS_AND_REPORTS,
			description: "Blood Test Results",
		});

		await documentRepository.save(doc1);
		await documentRepository.save(doc2);
	});

	it("should find a document by id", async () => {
		const findSpy = vi.spyOn(documentRepository, "find");
		const criteria = { id: doc1.id };

		const result = await findDocuments.handle(criteria);

		expect(findSpy).toHaveBeenCalledWith(criteria);
		expect(result).toHaveLength(1);
		expect(result[0]).toEqual(doc1);
	});

	it("should find a document by documentType", async () => {
		const findSpy = vi.spyOn(documentRepository, "find");
		const criteria = { documentType: DocumentCategory.EXAMS_AND_REPORTS };

		const result = await findDocuments.handle(criteria);

		expect(findSpy).toHaveBeenCalledWith(criteria);
		expect(result).toHaveLength(1);
		expect(result[0]).toEqual(doc2);
	});

	it("should find a document by a partial description match (case-insensitive)", async () => {
		const findSpy = vi.spyOn(documentRepository, "find");
		const criteria = { description: "blood test" };

		const result = await findDocuments.handle(criteria);

		expect(findSpy).toHaveBeenCalledWith(criteria);
		expect(result).toHaveLength(1);
		expect(result[0].description).toBe("Blood Test Results");
	});

	it("should find a document by a combination of criteria", async () => {
		const findSpy = vi.spyOn(documentRepository, "find");
		const criteria = {
			documentType: DocumentCategory.IDENTIFICATION,
			description: "RG",
		};

		const result = await findDocuments.handle(criteria);

		expect(findSpy).toHaveBeenCalledWith(criteria);
		expect(result).toHaveLength(1);
		expect(result[0]).toEqual(doc1);
	});

	it("should return an empty array if no document matches the criteria", async () => {
		const findSpy = vi.spyOn(documentRepository, "find");
		const criteria = { description: "Non Existent" };

		const result = await findDocuments.handle(criteria);

		expect(findSpy).toHaveBeenCalledWith(criteria);
		expect(result).toBeInstanceOf(Array);
		expect(result).toHaveLength(0);
	});

	it("should return all documents if no criteria is provided", async () => {
		const findSpy = vi.spyOn(documentRepository, "find");
		const criteria = {};

		const result = await findDocuments.handle(criteria);

		expect(findSpy).toHaveBeenCalledWith(criteria);
		expect(result).toHaveLength(2);
	});
});
