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
		return Promise.resolve(alreadyExists);
	}

	save(beneficiary: Beneficiary): Promise<Beneficiary> {
		this.beneficiaries.set(beneficiary.id, { ...beneficiary });
		return Promise.resolve(beneficiary);
	}

	findById(id: string): Promise<Beneficiary | null> {
		const beneficiaryData = this.beneficiaries.get(id);
		if (!beneficiaryData) {
			return Promise.resolve(null);
		}
		return Promise.resolve(this.mapDataToBeneficiary(beneficiaryData));
	}

	remove(beneficiary: Beneficiary): Promise<void> {
		this.beneficiaries.delete(beneficiary.id);
		return Promise.resolve();
	}

	findAll(): Promise<Beneficiary[]> {
		const beneficiaries = Array.from(this.beneficiaries.values()).map(
			(beneficiaryData) => this.mapDataToBeneficiary(beneficiaryData),
		);
		return Promise.resolve(beneficiaries);
	}

	find(
		criteria: Partial<{ id: string } & BeneficiaryData>,
	): Promise<Beneficiary[]> {
		const allBeneficiaries = Array.from(this.beneficiaries.values()).map(
			(data) => this.mapDataToBeneficiary(data),
		);
		if (allBeneficiaries.length === 0) {
			return Promise.resolve([]);
		}

		const filtered = allBeneficiaries.filter((beneficiary) => {
			return Object.entries(criteria).every(([key, value]) => {
				if (
					key === "name" &&
					typeof value === "string" &&
					typeof beneficiary.name === "string"
				) {
					return beneficiary.name.toLowerCase().includes(value.toLowerCase());
				}
				if (value === undefined) return true;
				if (
					key === "birthDate" &&
					beneficiary.birthDate instanceof Date &&
					value instanceof Date
				) {
					return beneficiary.birthDate.getTime() === value.getTime();
				}
				return beneficiary[key as keyof Beneficiary] === value;
			});
		});
		return Promise.resolve(filtered);
	}

	private mapDataToBeneficiary(
		data: BeneficiaryData & BeneficiaryProps,
	): Beneficiary {
		return Beneficiary.create(
			{ name: data.name, phone: data.phone, birthDate: data.birthDate },
			{
				id: data.id,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
		);
	}
}
