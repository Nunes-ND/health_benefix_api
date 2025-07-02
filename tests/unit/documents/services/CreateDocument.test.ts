import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	Document,
	DocumentCategory,
	DocumentData,
} from "@/documents/entities/Document";
import { DocumentRepository } from "@/documents/repositories/Document";
import { CreateDocument } from "@/documents/services/CreateDocument";
import { MockDocumentRepository } from "../__mocks__/DocumentRepository";

describe("Create Document Service", () => {
	let documentData: DocumentData;
	let documentRepository: DocumentRepository;
	let createDocument: CreateDocument;

	beforeEach(() => {
		documentData = {
			documentType: DocumentCategory.IDENTIFICATION,
			description: "RG: 12.345.678-9",
		};
		documentRepository = new MockDocumentRepository();
		createDocument = new CreateDocument(documentRepository);
	});

	it("should create a new document", async () => {
		const document = await createDocument.handle(documentData);

		expect(document).toEqual({
			id: expect.any(String),
			documentType: DocumentCategory.IDENTIFICATION,
			description: "RG: 12.345.678-9",
			createdAt: expect.any(Date),
			updatedAt: expect.any(Date),
		});
	});

	it("should not create a document if it already exists", async () => {
		await createDocument.handle(documentData);

		await expect(createDocument.handle(documentData)).rejects.toThrow(
			"Document already exists.",
		);
	});

	it("should propagate errors from the entity validation", async () => {
		const validationError = new Error("Any validation error from entity");
		vi.spyOn(Document, "create").mockImplementationOnce(() => {
			throw validationError;
		});

		await expect(createDocument.handle(documentData)).rejects.toThrow(
			validationError,
		);
	});

	describe("validation failures", () => {
		it.each([
			{ data: { description: "" }, expected: "Description cannot be empty." },
			{
				data: { description: "  " },
				expected: "Description cannot be empty.",
			},
			{
				data: { description: "a" },
				expected: "Description must be at least 2 characters long.",
			},
			{
				data: { documentType: undefined },
				expected: "Document type is required.",
			},
			{
				data: { documentType: "INVALID_TYPE" },
				expected: "Invalid document type.",
			},
		])(
			"should throw an error for invalid data: $expected",
			async ({ data, expected }) => {
				const invalidData = {
					...documentData,
					...data,
				} as DocumentData;

				await expect(createDocument.handle(invalidData)).rejects.toThrow(
					expected,
				);
			},
		);
	});
});
