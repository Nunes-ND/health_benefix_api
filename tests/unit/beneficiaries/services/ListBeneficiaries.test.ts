import { beforeEach, describe, expect, it, vi } from "vitest";
import { Beneficiary } from "@/beneficiaries/entities/Beneficiary";
import { ListBeneficiaries } from "@/beneficiaries/services/ListBeneficiaries";
import { MockBeneficiaryRepository } from "../__mocks__/BeneficiaryRepository";

describe("List Beneficiaries", () => {
	let beneficiariesRepository: MockBeneficiaryRepository;
	let listBeneficiaries: ListBeneficiaries;

	beforeEach(() => {
		beneficiariesRepository = new MockBeneficiaryRepository();
		listBeneficiaries = new ListBeneficiaries(beneficiariesRepository);
	});

	it("should return a list of all beneficiaries", async () => {
		const beneficiary1 = Beneficiary.create({
			name: "John Doe",
			phone: "(11) 98888-8888",
			birthDate: new Date("1990-05-15"),
		});
		const beneficiary2 = Beneficiary.create({
			name: "Jane Doe",
			phone: "(22) 97777-7777",
			birthDate: new Date("1992-10-20"),
		});
		await beneficiariesRepository.save(beneficiary1);
		await beneficiariesRepository.save(beneficiary2);
		const findAllSpy = vi.spyOn(beneficiariesRepository, "findAll");

		const beneficiaries = await listBeneficiaries.handle();

		expect(findAllSpy).toHaveBeenCalledOnce();
		expect(beneficiaries).toHaveLength(2);
		expect(beneficiaries[0]).toBeInstanceOf(Beneficiary);
		expect(beneficiaries).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ name: "John Doe" }),
				expect.objectContaining({ name: "Jane Doe" }),
			]),
		);
	});

	it("should return an empty array if no beneficiaries exist", async () => {
		const findAllSpy = vi.spyOn(beneficiariesRepository, "findAll");

		const beneficiaries = await listBeneficiaries.handle();

		expect(findAllSpy).toHaveBeenCalledOnce();
		expect(beneficiaries).toBeInstanceOf(Array);
		expect(beneficiaries).toHaveLength(0);
	});
});
