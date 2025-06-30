import { BeneficiaryRepository } from "../repositories/Beneficiary";

export class RemoveBeneficiary {
	constructor(private readonly beneficiaryRepository: BeneficiaryRepository) {
		this.beneficiaryRepository = beneficiaryRepository;
	}

	async handle(id: string) {
		const beneficiary = await this.beneficiaryRepository.findById(id);
		if (!beneficiary) {
			throw new Error("Beneficiary not found.");
		}

		await this.beneficiaryRepository.remove(beneficiary);
	}
}
