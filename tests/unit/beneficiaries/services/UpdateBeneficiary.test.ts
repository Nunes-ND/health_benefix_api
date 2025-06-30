import { beforeEach, describe, expect, it, vi } from "vitest";
import { Beneficiary } from "@/beneficiaries/entities/Beneficiary";
import { CreateBeneficiary } from "@/beneficiaries/services/CreateBeneficiary";
import { UpdateBeneficiary } from "@/beneficiaries/services/UpdateBeneficiary";
import { MockBeneficiaryRepository } from "../__mocks__/BeneficiaryRepository";

describe("Update Beneficiary", () => {
	let beneficiariesRepository: MockBeneficiaryRepository;
	let createBeneficiary: CreateBeneficiary;
	let updateBeneficiary: UpdateBeneficiary;
	let existingBeneficiary: Beneficiary;

	beforeEach(async () => {
		beneficiariesRepository = new MockBeneficiaryRepository();
		createBeneficiary = new CreateBeneficiary(beneficiariesRepository);
		updateBeneficiary = new UpdateBeneficiary(beneficiariesRepository);

		existingBeneficiary = await createBeneficiary.handle({
			name: "John Doe",
			phone: "(11) 98888-8888",
			birthDate: new Date("1990-05-15"),
		});
	});

	it("should update an existing beneficiary", async () => {
		const updatedData = {
			name: "John Doe Updated",
			phone: "(11) 97777-7777",
		};

		const updatedBeneficiary = await updateBeneficiary.handle({
			id: existingBeneficiary.id,
			data: updatedData,
		});

		expect(updatedBeneficiary.name).toBe(updatedData.name);
		expect(updatedBeneficiary.phone).toBe(updatedData.phone);
	});

	it("should throw an error if beneficiary is not found", async () => {
		await expect(
			updateBeneficiary.handle({
				id: "non-existing-id",
				data: { name: "any name" },
			}),
		).rejects.toThrow("Beneficiary not found.");
	});

	it("should propagate validation errors from the entity's update method", async () => {
		const validationError = new Error("Invalid phone number format.");
		const updateSpy = vi
			.spyOn(Beneficiary.prototype, "update")
			.mockImplementation(() => {
				throw validationError;
			});

		await expect(
			updateBeneficiary.handle({
				id: existingBeneficiary.id,
				data: { phone: "invalid" },
			}),
		).rejects.toThrow(validationError);
		updateSpy.mockRestore();
	});
});
