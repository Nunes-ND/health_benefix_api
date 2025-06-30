import { pool } from "@/database/postgres";
import { Beneficiary } from "../entities/Beneficiary";

export class BeneficiaryRepository {
	async exists(beneficiary: Beneficiary): Promise<boolean> {
		const result = await pool.query(
			"SELECT 1 FROM beneficiaries WHERE name = $1 AND phone = $2 AND birth_date = $3 LIMIT 1",
			[beneficiary.name, beneficiary.phone, beneficiary.birthDate],
		);
		return (result.rowCount ?? 0) > 0;
	}

	async save(beneficiary: Beneficiary): Promise<Beneficiary> {
		const query = `
      INSERT INTO beneficiaries (id, name, phone, birth_date, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        birth_date = EXCLUDED.birth_date,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
		const values = [
			beneficiary.id,
			beneficiary.name,
			beneficiary.phone,
			beneficiary.birthDate,
			beneficiary.createdAt,
			beneficiary.updatedAt,
		];

		const result = await pool.query(query, values);
		return this.mapRowToBeneficiary(result.rows[0]);
	}

	async findById(id: string): Promise<Beneficiary | null> {
		const result = await pool.query(
			"SELECT * FROM beneficiaries WHERE id = $1",
			[id],
		);
		if (result.rowCount === 0) {
			return null;
		}

		return this.mapRowToBeneficiary(result.rows[0]);
	}

	private mapRowToBeneficiary(row: {
		name: string;
		phone: string;
		birth_date: string | number | Date;
		id: string;
		created_at: string | number | Date;
		updated_at: string | number | Date;
	}): Beneficiary {
		return Beneficiary.create(
			{
				name: row.name,
				phone: row.phone,
				birthDate: new Date(row.birth_date),
			},
			{
				id: row.id,
				createdAt: new Date(row.created_at),
				updatedAt: new Date(row.updated_at),
			},
		);
	}
}
