package repository

import (
	"database/sql"
	"time"

	"github.com/larissasthefanny/plena-app/backend/internal/core/domain"
)

type PostgresGoalRepository struct {
	db *sql.DB
}

func NewPostgresGoalRepository(db *sql.DB) *PostgresGoalRepository {
	return &PostgresGoalRepository{db: db}
}

func (r *PostgresGoalRepository) Save(goal domain.Goal) (int, error) {
	query := `
		INSERT INTO goals (user_id, name, target_amount, current_amount, deadline, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id
	`
	var id int
	err := r.db.QueryRow(
		query,
		goal.UserID,
		goal.Name,
		goal.TargetAmount,
		goal.CurrentAmount,
		goal.Deadline,
		time.Now(),
	).Scan(&id)

	return id, err
}

func (r *PostgresGoalRepository) Update(goal domain.Goal) error {
	query := `
		UPDATE goals
		SET name = $1, target_amount = $2, deadline = $3
		WHERE id = $4 AND user_id = $5
	`
	_, err := r.db.Exec(query, goal.Name, goal.TargetAmount, goal.Deadline, goal.ID, goal.UserID)
	return err
}

func (r *PostgresGoalRepository) Delete(id, userID int) error {
	query := `DELETE FROM goals WHERE id = $1 AND user_id = $2`
	_, err := r.db.Exec(query, id, userID)
	return err
}

func (r *PostgresGoalRepository) ListByUserID(userID int) ([]domain.Goal, error) {
	query := `
		SELECT id, user_id, name, target_amount, current_amount, deadline, created_at
		FROM goals
		WHERE user_id = $1
		ORDER BY created_at DESC
	`
	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var goals []domain.Goal
	for rows.Next() {
		var g domain.Goal
		err := rows.Scan(&g.ID, &g.UserID, &g.Name, &g.TargetAmount, &g.CurrentAmount, &g.Deadline, &g.CreatedAt)
		if err != nil {
			return nil, err
		}
		goals = append(goals, g)
	}

	return goals, nil
}

func (r *PostgresGoalRepository) GetByID(id, userID int) (domain.Goal, error) {
	query := `
		SELECT id, user_id, name, target_amount, current_amount, deadline, created_at
		FROM goals
		WHERE id = $1 AND user_id = $2
	`
	var g domain.Goal
	err := r.db.QueryRow(query, id, userID).Scan(
		&g.ID, &g.UserID, &g.Name, &g.TargetAmount, &g.CurrentAmount, &g.Deadline, &g.CreatedAt,
	)
	return g, err
}

func (r *PostgresGoalRepository) AddProgress(id, userID int, amount float64) error {
	query := `
		UPDATE goals
		SET current_amount = current_amount + $1
		WHERE id = $2 AND user_id = $3
	`
	_, err := r.db.Exec(query, amount, id, userID)
	return err
}
