package repository

import (
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/larissasthefanny/plena-app/backend/internal/core/domain"
	"github.com/stretchr/testify/assert"
)

func TestGoalRepository_Save(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := NewPostgresGoalRepository(db)

	goal := domain.Goal{
		UserID:        1,
		Name:          "Viagem",
		TargetAmount:  5000.0,
		CurrentAmount: 0,
		Deadline:      time.Now().AddDate(0, 6, 0),
	}

	mock.ExpectQuery("INSERT INTO goals").
		WithArgs(goal.UserID, goal.Name, goal.TargetAmount, goal.CurrentAmount, sqlmock.AnyArg(), sqlmock.AnyArg()).
		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))

	id, err := repo.Save(goal)

	assert.NoError(t, err)
	assert.Equal(t, 1, id)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGoalRepository_ListByUserID(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := NewPostgresGoalRepository(db)

	deadline := time.Now().AddDate(0, 6, 0)
	rows := sqlmock.NewRows([]string{"id", "user_id", "name", "target_amount", "current_amount", "deadline", "created_at"}).
		AddRow(1, 1, "Viagem", 5000.0, 1000.0, deadline, time.Now()).
		AddRow(2, 1, "Carro", 30000.0, 5000.0, deadline, time.Now())

	mock.ExpectQuery("SELECT (.+) FROM goals WHERE user_id").
		WithArgs(1).
		WillReturnRows(rows)

	goals, err := repo.ListByUserID(1)

	assert.NoError(t, err)
	assert.Len(t, goals, 2)
	assert.Equal(t, "Viagem", goals[0].Name)
	assert.Equal(t, "Carro", goals[1].Name)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGoalRepository_Update(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := NewPostgresGoalRepository(db)

	goal := domain.Goal{
		ID:           1,
		UserID:       1,
		Name:         "Viagem Europa",
		TargetAmount: 8000.0,
		Deadline:     time.Now().AddDate(1, 0, 0),
	}

	mock.ExpectExec("UPDATE goals SET").
		WithArgs(goal.Name, goal.TargetAmount, goal.Deadline, goal.ID, goal.UserID).
		WillReturnResult(sqlmock.NewResult(0, 1))

	err = repo.Update(goal)

	assert.NoError(t, err)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGoalRepository_Delete(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := NewPostgresGoalRepository(db)

	mock.ExpectExec("DELETE FROM goals WHERE").
		WithArgs(1, 1).
		WillReturnResult(sqlmock.NewResult(0, 1))

	err = repo.Delete(1, 1)

	assert.NoError(t, err)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGoalRepository_AddProgress(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := NewPostgresGoalRepository(db)

	mock.ExpectExec("UPDATE goals SET current_amount").
		WithArgs(500.0, 1, 1).
		WillReturnResult(sqlmock.NewResult(0, 1))

	err = repo.AddProgress(1, 1, 500.0)

	assert.NoError(t, err)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGoalRepository_GetByID(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := NewPostgresGoalRepository(db)

	deadline := time.Now().AddDate(0, 6, 0)
	createdAt := time.Now()

	rows := sqlmock.NewRows([]string{"id", "user_id", "name", "target_amount", "current_amount", "deadline", "created_at"}).
		AddRow(1, 1, "Viagem", 5000.0, 1000.0, deadline, createdAt)

	mock.ExpectQuery("SELECT (.+) FROM goals WHERE id").
		WithArgs(1, 1).
		WillReturnRows(rows)

	goal, err := repo.GetByID(1, 1)

	assert.NoError(t, err)
	assert.Equal(t, 1, goal.ID)
	assert.Equal(t, "Viagem", goal.Name)
	assert.Equal(t, 5000.0, goal.TargetAmount)
	assert.Equal(t, 1000.0, goal.CurrentAmount)
	assert.NoError(t, mock.ExpectationsWereMet())
}
