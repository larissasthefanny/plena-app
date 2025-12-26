package repository

import (
	"database/sql"
	"errors"

	"github.com/larissasthefanny/plena-app/backend/internal/core/domain"
)

type PostgresUserRepository struct {
	db *sql.DB
}

func NewPostgresUserRepository(db *sql.DB) *PostgresUserRepository {
	repo := &PostgresUserRepository{db: db}
	repo.ensureSchema()
	return repo
}

func (r *PostgresUserRepository) ensureSchema() {
	query := `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		email TEXT UNIQUE NOT NULL,
		password TEXT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`
	r.db.Exec(query)

	r.db.Exec(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;`)
}

func (r *PostgresUserRepository) Save(u domain.User) (int, error) {
	query := `INSERT INTO users (email, password, created_at) VALUES ($1, $2, NOW()) RETURNING id`
	var id int
	err := r.db.QueryRow(query, u.Email, u.Password).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func (r *PostgresUserRepository) GetByEmail(email string) (domain.User, error) {
	query := `SELECT id, email, password, created_at FROM users WHERE email = $1`
	var u domain.User
	err := r.db.QueryRow(query, email).Scan(&u.ID, &u.Email, &u.Password, &u.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return domain.User{}, errors.New("user not found")
		}
		return domain.User{}, err
	}
	return u, nil
}
