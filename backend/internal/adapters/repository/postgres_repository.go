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

func (r *PostgresTransactionRepository) ListByUserID(userID int) ([]domain.Transaction, error) {
	query := `
		SELECT id, user_id, type, amount, category, COALESCE(description, ''), date, created_at
		FROM transactions
		WHERE user_id = $1
		ORDER BY date DESC
	`
	rows, err := r.db.Query(query, userID)
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
