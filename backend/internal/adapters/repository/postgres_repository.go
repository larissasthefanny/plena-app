package repository

import (
	"database/sql"
	"log"

	"github.com/larissasthefanny/plena-app/backend/internal/core/domain"
)

type PostgresTransactionRepository struct {
	db *sql.DB
}

func NewPostgresTransactionRepository(db *sql.DB) *PostgresTransactionRepository {
	repo := &PostgresTransactionRepository{db: db}
	repo.ensureSchema()
	return repo
}

func (r *PostgresTransactionRepository) ensureSchema() {
	query := `
	CREATE TABLE IF NOT EXISTS transactions (
		id SERIAL PRIMARY KEY,
		user_id INTEGER, 
		type TEXT NOT NULL,
		amount DECIMAL(10, 2) NOT NULL,
		category TEXT,
		description TEXT,
		date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`

	if _, err := r.db.Exec(query); err != nil {
		log.Println("Error creating table:", err)
	}

	r.db.Exec(`ALTER TABLE transactions ADD COLUMN IF NOT EXISTS description TEXT;`)
}

func (r *PostgresTransactionRepository) Save(t domain.Transaction) (int, error) {
	query := `
		INSERT INTO transactions (user_id, type, amount, category, description, date, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, NOW())
		RETURNING id`

	var id int
	err := r.db.QueryRow(query, t.UserID, t.Type, t.Amount, t.Category, t.Description, t.Date).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func (r *PostgresTransactionRepository) Update(t domain.Transaction) error {
	query := `
		UPDATE transactions 
		SET amount = $1, category = $2, description = $3, date = $4, type = $5
		WHERE id = $6 AND user_id = $7
	`
	result, err := r.db.Exec(query, t.Amount, t.Category, t.Description, t.Date, t.Type, t.ID, t.UserID)
	if err != nil {
		return err
	}
	rows, _ := result.RowsAffected()
	if rows == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (r *PostgresTransactionRepository) Delete(id, userID int) error {
	query := `DELETE FROM transactions WHERE id = $1 AND user_id = $2`
	result, err := r.db.Exec(query, id, userID)
	if err != nil {
		return err
	}
	rows, _ := result.RowsAffected()
	if rows == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (r *PostgresTransactionRepository) ListByUserID(userID, month, year int) ([]domain.Transaction, error) {
	query := `
		SELECT id, user_id, type, amount, category, COALESCE(description, ''), date, created_at
		FROM transactions
		WHERE user_id = $1 
		AND EXTRACT(MONTH FROM date) = $2 
		AND EXTRACT(YEAR FROM date) = $3
		ORDER BY date DESC
	`
	rows, err := r.db.Query(query, userID, month, year)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var transactions []domain.Transaction
	for rows.Next() {
		var t domain.Transaction
		if err := rows.Scan(&t.ID, &t.UserID, &t.Type, &t.Amount, &t.Category, &t.Description, &t.Date, &t.CreatedAt); err != nil {
			return nil, err
		}
		transactions = append(transactions, t)
	}
	return transactions, nil
}

func (r *PostgresTransactionRepository) DeleteAllByUserID(userID int) error {
	query := `DELETE FROM transactions WHERE user_id = $1`
	_, err := r.db.Exec(query, userID)
	return err
}
