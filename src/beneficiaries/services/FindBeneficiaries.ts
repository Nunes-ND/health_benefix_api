import { BeneficiaryData } from "../entities/Beneficiary";
import { BeneficiaryRepository } from "../repositories/Beneficiary";

export class FindBeneficiaries {
	constructor(private readonly beneficiaryRepository: BeneficiaryRepository) {
		this.beneficiaryRepository = beneficiaryRepository;
	}

	async handle(criteria: Partial<{ id: string } & BeneficiaryData>) {
		const beneficiariesFound = await this.beneficiaryRepository.find(criteria);
		return beneficiariesFound;
	}
}
