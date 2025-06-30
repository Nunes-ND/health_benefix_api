import {
	Beneficiary,
	BeneficiaryData,
	BeneficiaryProps,
} from "@/beneficiaries/entities/Beneficiary";
import { BeneficiaryRepository } from "@/beneficiaries/repositories/Beneficiary";

export class MockBeneficiaryRepository extends BeneficiaryRepository {
	beneficiaries: Map<string, BeneficiaryData & BeneficiaryProps> = new Map();

	exists(beneficiary: Beneficiary): Promise<boolean> {
		const alreadyExists = Array.from(this.beneficiaries.values()).some(
			(currentBeneficiary) =>
				currentBeneficiary.name === beneficiary.name &&
				currentBeneficiary.phone === beneficiary.phone &&
				currentBeneficiary.birthDate.getTime() ===
					beneficiary.birthDate.getTime(),
		);
		return new Promise((resolve) => resolve(alreadyExists));
	}

	save(beneficiary: Beneficiary): Promise<Beneficiary> {
		const { name, phone, birthDate } = beneficiary;
		const { id, createdAt, updatedAt } = beneficiary;
		this.beneficiaries.set(id, { ...beneficiary });
		const savedBeneficiary = Beneficiary.create(
			{ name, phone, birthDate },
			{ id, createdAt, updatedAt },
		);
		return new Promise((resolve) => resolve(savedBeneficiary));
	}

	findById(id: string): Promise<Beneficiary | null> {
		const beneficiaryData = this.beneficiaries.get(id);
		if (!beneficiaryData) {
			return new Promise((resolve) => resolve(null));
		}
		const { name, phone, birthDate } = beneficiaryData;
		const { createdAt, updatedAt } = beneficiaryData;
		const findBeneficiary = Beneficiary.create(
			{ name, phone, birthDate },
			{ id, createdAt, updatedAt },
		);
		return new Promise((resolve) => {
			resolve(findBeneficiary);
		});
	}

	remove(beneficiary: Beneficiary): Promise<void> {
		this.beneficiaries.delete(beneficiary.id);
		return new Promise((resolve) => resolve());
	}
}
