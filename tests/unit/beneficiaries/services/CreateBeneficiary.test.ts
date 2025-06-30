import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	Beneficiary,
	BeneficiaryData,
} from "@/beneficiaries/entities/Beneficiary";
import { BeneficiaryRepository } from "@/beneficiaries/repositories/Beneficiary";
import { CreateBeneficiary } from "@/beneficiaries/services/CreateBeneficiary";
import { MockBeneficiaryRepository } from "../__mocks__/BeneficiaryRepository";

describe("Create Beneficiary", () => {
	let beneficiaryData: BeneficiaryData;
	let beneficiariesRepository: BeneficiaryRepository;
	let createBeneficiary: CreateBeneficiary;

	beforeEach(() => {
		beneficiaryData = {
			name: "John Doe",
			phone: "(11) 99999-9999",
			birthDate: new Date("2000-01-01"),
		};
		beneficiariesRepository = new MockBeneficiaryRepository();
		createBeneficiary = new CreateBeneficiary(beneficiariesRepository);
	});

	it("should create a new beneficiary", async () => {
		const beneficiary = await createBeneficiary.handle(beneficiaryData);

		expect(beneficiary).toEqual({
			id: expect.any(String),
			name: "John Doe",
			phone: "(11) 99999-9999",
			birthDate: expect.any(Date),
			createdAt: expect.any(Date),
			updatedAt: expect.any(Date),
		});
	});

	it("should't create beneficiary if already exists", async () => {
		await createBeneficiary.handle(beneficiaryData);

		await expect(createBeneficiary.handle(beneficiaryData)).rejects.toThrow(
			"Beneficiary already exists.",
		);
	});

	it("should propagate errors from the entity validation", async () => {
		const validationError = new Error("Any validation error from entity");
		vi.spyOn(Beneficiary, "create").mockImplementationOnce(() => {
			throw validationError;
		});

		await expect(createBeneficiary.handle(beneficiaryData)).rejects.toThrow(
			validationError,
		);
	});

	describe("validation failures", () => {
		it.each([
			{
				data: { name: "", phone: "(11) 99999-9999" },
				expected: "Name is required.",
			},
			{
				data: { name: "John Doe", phone: "123" },
				expected:
					"Phone number is invalid. It must contain 9 to 15 digits and only valid characters.",
			},
		])(
			"should throw an error for invalid data: $expected",
			async ({ data, expected }) => {
				const invalidData = {
					...beneficiaryData,
					...data,
				};
				await expect(createBeneficiary.handle(invalidData)).rejects.toThrow(
					expected,
				);
			},
		);
	});
});
