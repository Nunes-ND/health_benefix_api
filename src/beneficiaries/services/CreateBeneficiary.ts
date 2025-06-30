import { Beneficiary, BeneficiaryData } from "../entities/Beneficiary";
import { BeneficiaryRepository } from "../repositories/Beneficiary";

export class CreateBeneficiary {
	constructor(private readonly beneficiaryRepository: BeneficiaryRepository) {
		this.beneficiaryRepository = beneficiaryRepository;
	}

	async handle({ name, phone, birthDate }: BeneficiaryData) {
		const beneficiary = Beneficiary.create({ name, phone, birthDate });

		if (await this.beneficiaryRepository.exists(beneficiary)) {
			throw new Error("Beneficiary already exists.");
		}

		const savedBeneficiary = await this.beneficiaryRepository.save(beneficiary);
		return savedBeneficiary;
	}
}
