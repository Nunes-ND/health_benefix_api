import { pool } from "@/database/postgres";
import { Document, DocumentCategory, DocumentData } from "../entities/Document";

interface DocumentRow {
	id: string;
	document_type: DocumentCategory;
	description: string;
	created_at: Date;
	updated_at: Date;
}

export class DocumentRepository {
	async exists(document: Document): Promise<boolean> {
		const result = await pool.query(
			"SELECT 1 FROM documents WHERE description = $1 LIMIT 1",
			[document.description],
		);
		return (result.rowCount ?? 0) > 0;
	}

	async save(document: Document): Promise<Document> {
		const query = `
      INSERT INTO documents (id, document_type, description, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
		const values = [
			document.id,
			document.documentType,
			document.description,
			document.createdAt,
			document.updatedAt,
		];

		const result = await pool.query<DocumentRow>(query, values);
		return this.mapRowToDocument(result.rows[0]);
	}

	async findById(id: string): Promise<Document | null> {
		const query = "SELECT * FROM documents WHERE id = $1 LIMIT 1";
		const result = await pool.query<DocumentRow>(query, [id]);

		if (result.rowCount === 0) {
			return null;
		}

		return this.mapRowToDocument(result.rows[0]);
	}

	async update(document: Document): Promise<Document> {
		const query = `
      UPDATE documents
      SET description = $1, updated_at = $2
      WHERE id = $3
      RETURNING *;
    `;
		const values = [document.description, document.updatedAt, document.id];

		const result = await pool.query<DocumentRow>(query, values);

		return this.mapRowToDocument(result.rows[0]);
	}

	async remove(document: Document): Promise<void> {
		const query = "DELETE FROM documents WHERE id = $1";
		await pool.query(query, [document.id]);
	}

	async findAll(): Promise<Document[]> {
		const query = "SELECT * FROM documents ORDER BY created_at DESC";
		const result = await pool.query<DocumentRow>(query);
		return result.rows.map((row) => this.mapRowToDocument(row));
	}

	async find(
		criteria: Partial<{ id: string } & DocumentData>,
	): Promise<Document[]> {
		if (Object.keys(criteria).length === 0) {
			return this.findAll();
		}

		const queryParts: string[] = [];
		const values: (string | DocumentCategory)[] = [];
		let valueCount = 1;

		if (criteria.id) {
			queryParts.push(`id = $${valueCount++}`);
			values.push(criteria.id);
		}
		if (criteria.documentType) {
			queryParts.push(`document_type = $${valueCount++}`);
			values.push(criteria.documentType);
		}
		if (criteria.description) {
			queryParts.push(`description ILIKE $${valueCount++}`);
			values.push(`%${criteria.description}%`);
		}

		const whereClause = queryParts.join(" AND ");
		const query = `SELECT * FROM documents WHERE ${whereClause} ORDER BY created_at DESC`;

		const result = await pool.query<DocumentRow>(query, values);
		return result.rows.map((row) => this.mapRowToDocument(row));
	}

	private mapRowToDocument(row: DocumentRow): Document {
		return Document.create(
			{
				documentType: row.document_type,
				description: row.description,
			},
			{
				id: row.id,
				createdAt: new Date(row.created_at),
				updatedAt: new Date(row.updated_at),
			},
		);
	}
}
