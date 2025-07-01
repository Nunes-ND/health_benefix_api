import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
	Document,
	DocumentCategory,
	DocumentData,
} from "@/documents/entities/Document";

describe("Document Entity", () => {
	const validDocumentData: DocumentData = {
		documentType: DocumentCategory.IDENTIFICATION,
		description: "RG: 12.345.678-9",
	};

	describe("create() - new document", () => {
		it("should create a new document successfully", () => {
			const document = Document.create(validDocumentData);

			expect(document).toBeInstanceOf(Document);
			expect(document.id).toEqual(expect.any(String));
			expect(document.documentType).toBe(validDocumentData.documentType);
			expect(document.description).toBe(validDocumentData.description);
			expect(document.createdAt).toBeInstanceOf(Date);
			expect(document.updatedAt).toBeInstanceOf(Date);
			expect(document.createdAt).toEqual(document.updatedAt);
		});

		it("should throw an error if description is empty", () => {
			expect(() =>
				Document.create({ ...validDocumentData, description: "" }),
			).toThrow("Description cannot be empty.");
		});

		it("should throw an error if description is just whitespace", () => {
			expect(() =>
				Document.create({ ...validDocumentData, description: "   " }),
			).toThrow("Description cannot be empty.");
		});

		it("should throw an error if description is too short", () => {
			expect(() =>
				Document.create({ ...validDocumentData, description: "a" }),
			).toThrow("Description must be at least 2 characters long.");
		});

		it("should throw an error if documentType is not provided", () => {
			const invalidData = {
				...validDocumentData,
				documentType: undefined as unknown as DocumentCategory,
			};
			expect(() => Document.create(invalidData)).toThrow(
				"Document type is required.",
			);
		});

		it("should throw an error for an invalid documentType", () => {
			const invalidData = {
				...validDocumentData,
				documentType: "INVALID_TYPE" as DocumentCategory,
			};
			expect(() => Document.create(invalidData)).toThrow(
				"Invalid document type.",
			);
		});
	});

	describe("create() - with existing props (recreation)", () => {
		const existingDocumentProps = {
			id: randomUUID(),
			createdAt: new Date("2023-01-01T10:00:00Z"),
			updatedAt: new Date("2023-01-02T11:00:00Z"),
		};

		it("should recreate a document instance from existing data", () => {
			const document = Document.create(
				validDocumentData,
				existingDocumentProps,
			);

			expect(document).toBeInstanceOf(Document);
			expect(document.id).toBe(existingDocumentProps.id);
			expect(document.documentType).toBe(validDocumentData.documentType);
			expect(document.description).toBe(validDocumentData.description);
			expect(document.createdAt).toEqual(existingDocumentProps.createdAt);
			expect(document.updatedAt).toEqual(existingDocumentProps.updatedAt);
		});

		it("should throw an error if id is not a valid UUID", () => {
			expect(() =>
				Document.create(validDocumentData, {
					...existingDocumentProps,
					id: "invalid-uuid",
				}),
			).toThrow("ID must be a valid UUID.");
		});

		it("should throw an error if updatedAt is before createdAt", () => {
			expect(() =>
				Document.create(validDocumentData, {
					...existingDocumentProps,
					createdAt: new Date("2023-01-02T11:00:00Z"),
					updatedAt: new Date("2023-01-01T10:00:00Z"),
				}),
			).toThrow("Update date cannot be before creation date.");
		});

		it("should throw an error if createdAt is in the future", () => {
			const futureDate = new Date();
			futureDate.setDate(futureDate.getDate() + 1);
			expect(() =>
				Document.create(validDocumentData, {
					...existingDocumentProps,
					createdAt: futureDate,
				}),
			).toThrow("Creation date cannot be in the future.");
		});

		it("should throw an error if updatedAt is in the future", () => {
			const futureDate = new Date();
			futureDate.setDate(futureDate.getDate() + 1);
			expect(() =>
				Document.create(validDocumentData, {
					...existingDocumentProps,
					updatedAt: futureDate,
				}),
			).toThrow("Update date cannot be in the future.");
		});

		it("should throw an error if createdAt is an invalid date", () => {
			expect(() =>
				Document.create(validDocumentData, {
					...existingDocumentProps,
					createdAt: new Date("invalid-date"),
				}),
			).toThrow("Creation date must be a valid date.");
		});

		it("should throw an error if updatedAt is an invalid date", () => {
			expect(() =>
				Document.create(validDocumentData, {
					...existingDocumentProps,
					updatedAt: new Date("invalid-date"),
				}),
			).toThrow("Update date must be a valid date.");
		});
	});
});
