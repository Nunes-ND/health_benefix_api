import { beforeEach, describe, expect, it, vi } from "vitest";
import { Beneficiary } from "@/beneficiaries/entities/Beneficiary";
import { RemoveBeneficiary } from "@/beneficiaries/services/RemoveBeneficiary";
import { MockBeneficiaryRepository } from "../__mocks__/BeneficiaryRepository";

describe("Remove Beneficiary", () => {
	let beneficiariesRepository: MockBeneficiaryRepository;
	let removeBeneficiary: RemoveBeneficiary;
	let existingBeneficiary: Beneficiary;

	beforeEach(async () => {
		beneficiariesRepository = new MockBeneficiaryRepository();
		removeBeneficiary = new RemoveBeneficiary(beneficiariesRepository);
		existingBeneficiary = Beneficiary.create({
			name: "John Doe",
			phone: "(11) 98888-8888",
			birthDate: new Date("1990-05-15"),
		});
		await beneficiariesRepository.save(existingBeneficiary);
	});

	it("should remove an existing beneficiary", async () => {
		const removeSpy = vi.spyOn(beneficiariesRepository, "remove");

		await removeBeneficiary.handle(existingBeneficiary.id);

		const removedBeneficiary = await beneficiariesRepository.findById(
			existingBeneficiary.id,
		);
		expect(removedBeneficiary).toBeNull();
		expect(removeSpy).toHaveBeenCalledWith(existingBeneficiary);
	});

	it("should throw an error if beneficiary is not found", async () => {
		await expect(removeBeneficiary.handle("non-existing-id")).rejects.toThrow(
			"Beneficiary not found.",
		);
	});
});
