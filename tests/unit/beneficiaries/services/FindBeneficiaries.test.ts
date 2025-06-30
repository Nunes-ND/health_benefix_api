import { beforeEach, describe, expect, it, vi } from "vitest";
import { Beneficiary } from "@/beneficiaries/entities/Beneficiary";
import { FindBeneficiaries } from "@/beneficiaries/services/FindBeneficiaries";
import { MockBeneficiaryRepository } from "../__mocks__/BeneficiaryRepository";

describe("Find Beneficiaries", () => {
	let beneficiariesRepository: MockBeneficiaryRepository;
	let findBeneficiary: FindBeneficiaries;
	let beneficiary1: Beneficiary;
	let beneficiary2: Beneficiary;

	beforeEach(async () => {
		beneficiariesRepository = new MockBeneficiaryRepository();
		findBeneficiary = new FindBeneficiaries(beneficiariesRepository);
		beneficiary1 = Beneficiary.create({
			name: "John Doe",
			phone: "(11) 98888-8888",
			birthDate: new Date("1990-05-15"),
		});
		beneficiary2 = Beneficiary.create({
			name: "Jane Doe",
			phone: "(22) 97777-7777",
			birthDate: new Date("1992-10-20"),
		});

		await beneficiariesRepository.save(beneficiary1);
		await beneficiariesRepository.save(beneficiary2);
	});

	it("should find a beneficiary by id", async () => {
		const findSpy = vi.spyOn(beneficiariesRepository, "find");
		const criteria = { id: beneficiary1.id };

		const result = await findBeneficiary.handle(criteria);

		expect(findSpy).toHaveBeenCalledWith(criteria);
		expect(result).toHaveLength(1);
		expect(result[0]).toEqual(beneficiary1);
	});

	it("should find a beneficiary by name", async () => {
		const findSpy = vi.spyOn(beneficiariesRepository, "find");
		const criteria = { name: "Jane Doe" };

		const result = await findBeneficiary.handle(criteria);

		expect(findSpy).toHaveBeenCalledWith(criteria);
		expect(result).toHaveLength(1);
		expect(result[0]).toEqual(beneficiary2);
	});

	it("should find a beneficiary by phone", async () => {
		const findSpy = vi.spyOn(beneficiariesRepository, "find");
		const criteria = { phone: "(22) 97777-7777" };

		const result = await findBeneficiary.handle(criteria);

		expect(findSpy).toHaveBeenCalledWith(criteria);
		expect(result).toHaveLength(1);
		expect(result[0]).toEqual(beneficiary2);
	});

	it("should find a beneficiary by birthDate", async () => {
		const findSpy = vi.spyOn(beneficiariesRepository, "find");
		const criteria = { birthDate: beneficiary2.birthDate };

		const result = await findBeneficiary.handle(criteria);

		expect(findSpy).toHaveBeenCalledWith(criteria);
		expect(result).toHaveLength(1);
		expect(result[0]).toEqual(beneficiary2);
	});

	it("should find a beneficiary by a combination of criteria", async () => {
		const findSpy = vi.spyOn(beneficiariesRepository, "find");
		const criteria = { name: "John Doe", phone: "(11) 98888-8888" };

		const result = await findBeneficiary.handle(criteria);

		expect(findSpy).toHaveBeenCalledWith(criteria);
		expect(result).toHaveLength(1);
		expect(result[0]).toEqual(beneficiary1);
	});

	it("should return an empty array if no beneficiary matches the criteria", async () => {
		const findSpy = vi.spyOn(beneficiariesRepository, "find");
		const criteria = { name: "Non Existent" };

		const result = await findBeneficiary.handle(criteria);

		expect(findSpy).toHaveBeenCalledWith(criteria);
		expect(result).toBeInstanceOf(Array);
		expect(result).toHaveLength(0);
	});

	it("should return an empty array when the repository is empty", async () => {
		const emptyRepository = new MockBeneficiaryRepository();
		const findBeneficiaryWithEmptyRepo = new FindBeneficiaries(emptyRepository);
		const findSpy = vi.spyOn(emptyRepository, "find");
		const criteria = { name: "Any Name" };

		const result = await findBeneficiaryWithEmptyRepo.handle(criteria);

		expect(findSpy).toHaveBeenCalledWith(criteria);
		expect(result).toEqual([]);
	});

	it("should find beneficiaries by a partial name match (case-insensitive)", async () => {
		const findSpy = vi.spyOn(beneficiariesRepository, "find");
		const criteria = { name: "john" };

		const result = await findBeneficiary.handle(criteria);

		expect(findSpy).toHaveBeenCalledWith(criteria);
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("John Doe");
	});
});
