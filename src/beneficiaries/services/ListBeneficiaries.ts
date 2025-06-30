import { BeneficiaryRepository } from "../repositories/Beneficiary";

export class ListBeneficiaries {
	constructor(private readonly beneficiaryRepository: BeneficiaryRepository) {
		this.beneficiaryRepository = beneficiaryRepository;
	}

	async handle() {
		const beneficiaries = await this.beneficiaryRepository.findAll();
		return beneficiaries;
	}
}
