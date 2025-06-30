import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	Beneficiary,
	BeneficiaryData,
	BeneficiaryProps,
} from "@/beneficiaries/entities/Beneficiary";

describe("Beneficiary", () => {
	describe("when creating a new beneficiary", () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		const validBeneficiaryData: BeneficiaryData = {
			name: "John Doe",
			phone: "(11) 99999-9999",
			birthDate: new Date("2007-01-01"),
		};

		it("should create a new beneficiary with valid data", () => {
			const fixedDate = new Date("2025-01-01");
			vi.setSystemTime(fixedDate);

			const beneficiary = Beneficiary.create(validBeneficiaryData);

			expect(beneficiary).toBeInstanceOf(Beneficiary);
			expect(beneficiary.id).toEqual(expect.any(String));
			expect(beneficiary.name).toBe(validBeneficiaryData.name);
			expect(beneficiary.phone).toBe(validBeneficiaryData.phone);
			expect(beneficiary.birthDate).toEqual(validBeneficiaryData.birthDate);
			expect(beneficiary.createdAt).toEqual(fixedDate);
			expect(beneficiary.updatedAt).toEqual(fixedDate);
		});

		it.each([
			{ name: "", expected: "Name is required." },
			{ name: "   ", expected: "Name is required." },
		])(
			"should throw an error if name is invalid: $name",
			({ name, expected }) => {
				const data = { ...validBeneficiaryData, name };
				expect(() => Beneficiary.create(data)).toThrow(expected);
			},
		);

		const phoneErrors = {
			required: "Phone is required.",
			invalid:
				"Phone number is invalid. It must contain 9 to 15 digits and only valid characters.",
		};
		it.each([
			{ phone: "", expected: phoneErrors.required },
			{ phone: "   ", expected: phoneErrors.required },
			{ phone: "invalid-phone", expected: phoneErrors.invalid },
			{ phone: "123-abc-456", expected: phoneErrors.invalid },
			{ phone: "12345678", expected: phoneErrors.invalid },
			{ phone: "1234567890123456", expected: phoneErrors.invalid },
			{ phone: "() - +", expected: phoneErrors.invalid },
		])(
			"should throw an error if phone is invalid: $phone",
			({ phone, expected }) => {
				const data = { ...validBeneficiaryData, phone };
				expect(() => Beneficiary.create(data)).toThrow(expected);
			},
		);

		it.each([
			{ phone: "(11) 99999-9999" },
			{ phone: "+55 (11) 98765-4321" },
			{ phone: "11987654321" },
			{ phone: "123456789" },
			{ phone: "123456789012345" },
		])(
			"should create a beneficiary with a valid phone number: $phone",
			({ phone }) => {
				const data = { ...validBeneficiaryData, phone };
				const beneficiary = Beneficiary.create(data);

				expect(beneficiary).toBeInstanceOf(Beneficiary);
				expect(beneficiary.phone).toBe(phone);
			},
		);

		it("should throw an error if birth date is in the future", () => {
			const now = new Date("2025-05-20T10:00:00.000Z");
			vi.setSystemTime(now);

			const futureDate = new Date("2025-05-20T10:00:00.001Z");
			const data = { ...validBeneficiaryData, birthDate: futureDate };

			expect(() => Beneficiary.create(data)).toThrow(
				"Birth date cannot be in the future.",
			);
		});

		it("should throw an error if birth date is an invalid Date object", () => {
			const data = {
				...validBeneficiaryData,
				birthDate: new Date("invalid-date-string"),
			};

			expect(() => Beneficiary.create(data)).toThrow(
				"Birth date must be a valid date.",
			);
		});
	});

	describe("when recreating from existing data", () => {
		const now = new Date("2025-01-01T10:00:00.000Z");
		let validBeneficiaryData: BeneficiaryData;
		let validBeneficiaryProps: BeneficiaryProps;

		beforeEach(() => {
			vi.useFakeTimers();
			vi.setSystemTime(now);

			validBeneficiaryData = {
				name: "Jane Doe",
				phone: "11987654321",
				birthDate: new Date("1995-05-25"),
			};
			validBeneficiaryProps = {
				id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
				createdAt: new Date("2025-01-01T09:00:00.000Z"),
				updatedAt: new Date("2025-01-01T09:30:00.000Z"),
			};
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it("should recreate a beneficiary from existing valid data", () => {
			const beneficiary = Beneficiary.create(
				validBeneficiaryData,
				validBeneficiaryProps,
			);

			expect(beneficiary.id).toBe(validBeneficiaryProps.id);
			expect(beneficiary.name).toBe(validBeneficiaryData.name);
			expect(beneficiary.createdAt).toEqual(validBeneficiaryProps.createdAt);
			expect(beneficiary.updatedAt).toEqual(validBeneficiaryProps.updatedAt);
		});

		it("should throw an error if recreate with an invalid UUID", () => {
			expect(() =>
				Beneficiary.create(validBeneficiaryData, {
					...validBeneficiaryProps,
					id: "invalid-uuid",
				}),
			).toThrow("ID must be a valid UUID.");
		});

		it("should throw an error if recreate with a future createdAt date", () => {
			expect(() =>
				Beneficiary.create(validBeneficiaryData, {
					...validBeneficiaryProps,
					createdAt: new Date("2025-01-01T10:00:00.001Z"),
				}),
			).toThrow("Creation date cannot be in the future.");
		});

		it("should throw an error if recreate with an invalid createdAt date", () => {
			expect(() =>
				Beneficiary.create(validBeneficiaryData, {
					...validBeneficiaryProps,
					createdAt: new Date("invalid-date"),
				}),
			).toThrow("Creation date must be a valid date.");
		});

		it("should throw an error if updatedAt is before createdAt", () => {
			expect(() =>
				Beneficiary.create(validBeneficiaryData, {
					...validBeneficiaryProps,
					updatedAt: new Date("2025-01-01T08:59:59.999Z"),
				}),
			).toThrow("Update date cannot be before creation date.");
		});
	});
});
