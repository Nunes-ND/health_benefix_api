import { BeneficiaryData } from "../entities/Beneficiary";
import { BeneficiaryRepository } from "../repositories/Beneficiary";

type Props = {
	id: string;
	data: Partial<Pick<BeneficiaryData, "name" | "phone">>;
};

export class UpdateBeneficiary {
	constructor(private readonly beneficiaryRepository: BeneficiaryRepository) {}

	async handle({ id, data }: Props) {
		const beneficiary = await this.beneficiaryRepository.findById(id);

		if (!beneficiary) {
			throw new Error("Beneficiary not found.");
		}

		beneficiary.update(data);

		await this.beneficiaryRepository.save(beneficiary);
		return beneficiary;
	}
}
