import { beforeEach, describe, expect, it } from "vitest";
import { Document, DocumentCategory } from "@/documents/entities/Document";
import { UpdateDocument } from "@/documents/services/UpdateDocument";
import { MockDocumentRepository } from "../__mocks__/DocumentRepository";

describe("UpdateDocument", () => {
	let documentRepository: MockDocumentRepository;
	let updateDocument: UpdateDocument;

	beforeEach(() => {
		documentRepository = new MockDocumentRepository();
		updateDocument = new UpdateDocument(documentRepository);
	});

	it("should update a document description and its updatedAt date", async () => {
		const initialDocument = Document.create({
			documentType: DocumentCategory.EXAMS_AND_REPORTS,
			description: "Initial Description",
		});
		await documentRepository.save(initialDocument);

		const newDescription = "Updated Description";
		const updatedDocument = await updateDocument.handle({
			id: initialDocument.id,
			data: {
				description: newDescription,
			},
		});

		expect(updatedDocument.description).toBe(newDescription);
		expect(updatedDocument.updatedAt.getTime()).toBeGreaterThan(
			initialDocument.createdAt.getTime(),
		);
		const docInDb = await documentRepository.findById(initialDocument.id);
		expect(docInDb).not.toBeNull();
		expect(docInDb?.description).toBe(newDescription);
	});

	it("should throw an error if document is not found", async () => {
		const nonExistentId = "non-existent-id";

		await expect(
			updateDocument.handle({
				id: nonExistentId,
				data: {
					description: "Any description",
				},
			}),
		).rejects.toThrow("Document not found.");
	});

	describe("validation failures", () => {
		it.each([
			{ description: "", expected: "Description cannot be empty." },
			{ description: "  ", expected: "Description cannot be empty." },
			{
				description: "a",
				expected: "Description must be at least 2 characters long.",
			},
		])(
			"should throw an error for an invalid description: '$description'",
			async ({ description, expected }) => {
				const initialDocument = Document.create({
					documentType: DocumentCategory.EXAMS_AND_REPORTS,
					description: "Valid Description",
				});
				await documentRepository.save(initialDocument);

				await expect(
					updateDocument.handle({
						id: initialDocument.id,
						data: { description },
					}),
				).rejects.toThrow(expected);
			},
		);
	});
});
