import { randomUUID } from "node:crypto";

export type DocumentProps = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
};

export enum DocumentCategory {
	IDENTIFICATION = "DOCUMENTO_IDENTIFICACAO",
	GUIDES_AND_AUTHORIZATIONS = "GUIAS_E_AUTORIZACOES",
	EXAMS_AND_REPORTS = "EXAMES_E_LAUDOS",
	PRESCRIPTIONS = "RECEITAS_E_PRESCRICOES",
}

export type DocumentData = {
	documentType: DocumentCategory;
	description: string;
};

export class Document {
	id: string;
	documentType: DocumentCategory;
	description: string;
	createdAt: Date;
	updatedAt: Date;

	private constructor(data: DocumentData, props?: DocumentProps) {
		this.validate(data, props);
		this.id = props?.id ?? randomUUID();
		this.documentType = data.documentType;
		this.description = data.description;
		this.createdAt = props?.createdAt ?? new Date();
		this.updatedAt = props?.updatedAt ?? new Date();
	}

	static create(data: DocumentData, props?: DocumentProps): Document {
		return new Document(data, props);
	}

	updateDescription(description: string): void {
		this.validateData({ description, documentType: this.documentType });
		this.description = description;
		this.touch();
	}

	private validate(data: DocumentData, props?: DocumentProps): void {
		const { description, documentType } = data;
		this.validateData({ description, documentType });

		if (props) {
			const { id, createdAt, updatedAt } = props;
			this.validateProps({ id, createdAt, updatedAt });
		}
	}

	private validateData(props: DocumentData): void {
		if (!props.description || props.description.trim().length === 0) {
			throw new Error("Description cannot be empty.");
		}
		if (props.description.trim().length < 2) {
			throw new Error("Description must be at least 2 characters long.");
		}
		if (!props.documentType) {
			throw new Error("Document type is required.");
		}
		if (!Object.values(DocumentCategory).includes(props.documentType)) {
			throw new Error("Invalid document type.");
		}
	}

	private validateProps({
		id,
		createdAt,
		updatedAt,
	}: Pick<DocumentProps, "id" | "createdAt" | "updatedAt">) {
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
