import { randomUUID } from "node:crypto";

export type BeneficiaryProps = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
};

export type BeneficiaryData = {
	name: string;
	phone: string;
	birthDate: Date;
};

export class Beneficiary {
	id: string;
	name: string;
	phone: string;
	birthDate: Date;
	createdAt: Date;
	updatedAt: Date;

	private constructor(data: BeneficiaryData, props?: BeneficiaryProps) {
		this.validate(data, props);
		this.id = props?.id ?? randomUUID();
		this.name = data.name;
		this.phone = data.phone;
		this.birthDate = data.birthDate;
		this.createdAt = props?.createdAt ?? new Date();
		this.updatedAt = props?.updatedAt ?? new Date();
	}

	static create(data: BeneficiaryData, props?: BeneficiaryProps) {
		return new Beneficiary(data, props);
	}

	update(data: Partial<Pick<BeneficiaryData, "name" | "phone">>) {
		if (data.name !== undefined) {
			this.validateName(data.name);
			this.name = data.name;
		}
		if (data.phone !== undefined) {
			this.validatePhone(data.phone);
			this.phone = data.phone;
		}

		this.touch();
	}

	private validate(data: BeneficiaryData, props?: BeneficiaryProps) {
		const { name, phone, birthDate } = data;
		this.validateProps({ name, phone, birthDate });

		if (props) {
			const { id, createdAt, updatedAt } = props;
			this.validateData({ id, createdAt, updatedAt });
		}
	}

	private validateName(name: string) {
		if (!name || name.trim().length === 0) {
			throw new Error("Name is required.");
		}
	}

	private validatePhone(phone: string) {
		if (!phone || phone.trim().length === 0) {
			throw new Error("Phone is required.");
		}
		if (!/^(?=(?:\D*\d){9,15}\D*$)[0-9-()+\s]+$/.test(phone)) {
			throw new Error(
				"Phone number is invalid. It must contain 9 to 15 digits and only valid characters.",
			);
		}
	}

	private validateProps({
		name,
		phone,
		birthDate,
	}: Pick<BeneficiaryData, "name" | "phone" | "birthDate">) {
		this.validateName(name);
		this.validatePhone(phone);
		this.validateDate(birthDate, "Birth date");
	}

	private validateData({
		id,
		createdAt,
		updatedAt,
	}: Pick<BeneficiaryProps, "id" | "createdAt" | "updatedAt">) {
		if (
			id &&
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
				id,
			)
		) {
			throw new Error("ID must be a valid UUID.");
		}

		if (createdAt) {
			this.validateDate(createdAt, "Creation date");
		}

		if (updatedAt) {
			this.validateDate(updatedAt, "Update date");
			if (createdAt && updatedAt < createdAt) {
				throw new Error("Update date cannot be before creation date.");
			}
		}
	}

	private validateDate(date: Date | undefined, fieldName: string) {
		if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
			throw new Error(`${fieldName} must be a valid date.`);
		}
		if (date > new Date()) {
			throw new Error(`${fieldName} cannot be in the future.`);
		}
	}

	private touch() {
		this.updatedAt = new Date();
	}
}
