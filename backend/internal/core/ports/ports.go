package ports

import (
	"time"

	"github.com/larissasthefanny/plena-app/backend/internal/core/domain"
)

type TransactionRepository interface {
	Save(transaction domain.Transaction) (int, error)
	Update(transaction domain.Transaction) error
	Delete(id, userID int) error
	ListByUserID(userID, month, year int) ([]domain.Transaction, error)
	DeleteAllByUserID(userID int) error
}

type UserRepository interface {
	Save(user domain.User) (int, error)
	GetByEmail(email string) (domain.User, error)
}

type TransactionService interface {
	CreateIncome(userID int, amount float64, category, description string, date time.Time) (domain.Transaction, error)
	CreateExpense(userID int, amount float64, category, description string, date time.Time) (domain.Transaction, error)
	UpdateTransaction(userID, id int, amount float64, category, description string, date time.Time, typeStr string) error
	DeleteTransaction(userID, id int) error
	ListTransactions(userID, month, year int) ([]domain.Transaction, error)
	ResetData(userID int) error
}

type AuthService interface {
	Register(email, password string) (string, error)
	Login(email, password string) (string, error)
}

type GoalRepository interface {
	Save(goal domain.Goal) (int, error)
	Update(goal domain.Goal) error
	Delete(id, userID int) error
	ListByUserID(userID int) ([]domain.Goal, error)
	GetByID(id, userID int) (domain.Goal, error)
	AddProgress(id, userID int, amount float64) error
}

type GoalService interface {
	CreateGoal(userID int, name string, targetAmount float64, deadline time.Time) (domain.Goal, error)
	UpdateGoal(userID, id int, name string, targetAmount float64, deadline time.Time) error
	DeleteGoal(userID, id int) error
	ListGoals(userID int) ([]domain.Goal, error)
	AddProgress(userID, goalID int, amount float64) error
}
