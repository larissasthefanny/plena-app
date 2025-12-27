package services

import (
	"time"

	"github.com/larissasthefanny/plena-app/backend/internal/core/domain"
	"github.com/larissasthefanny/plena-app/backend/internal/core/ports"
)

type TransactionService struct {
	repo ports.TransactionRepository
}

func NewTransactionService(repo ports.TransactionRepository) *TransactionService {
	return &TransactionService{
		repo: repo,
	}
}

func (s *TransactionService) CreateIncome(userID int, amount float64, category, description string, date time.Time) (domain.Transaction, error) {
	if date.IsZero() {
		date = time.Now()
	}
	transaction := domain.Transaction{
		UserID:      userID,
		Type:        "income",
		Amount:      amount,
		Category:    category,
		Description: description,
		Date:        date,
	}

	id, err := s.repo.Save(transaction)
	if err != nil {
		return domain.Transaction{}, err
	}

	transaction.ID = id
	return transaction, nil
}

func (s *TransactionService) CreateExpense(userID int, amount float64, category, description string, date time.Time) (domain.Transaction, error) {
	if date.IsZero() {
		date = time.Now()
	}
	transaction := domain.Transaction{
		UserID:      userID,
		Type:        "expense",
		Amount:      amount,
		Category:    category,
		Description: description,
		Date:        date,
	}

	id, err := s.repo.Save(transaction)
	if err != nil {
		return domain.Transaction{}, err
	}

	transaction.ID = id
	return transaction, nil
}

func (s *TransactionService) UpdateTransaction(userID, id int, amount float64, category, description string, date time.Time, typeStr string) error {
	if date.IsZero() {
		date = time.Now()
	}
	t := domain.Transaction{
		ID:          id,
		UserID:      userID,
		Amount:      amount,
		Category:    category,
		Description: description,
		Date:        date,
		Type:        typeStr,
	}
	return s.repo.Update(t)
}

func (s *TransactionService) DeleteTransaction(userID, id int) error {
	return s.repo.Delete(id, userID)
}

func (s *TransactionService) ListTransactions(userID, month, year int) ([]domain.Transaction, error) {
	return s.repo.ListByUserID(userID, month, year)
}

func (s *TransactionService) ResetData(userID int) error {
	return s.repo.DeleteAllByUserID(userID)
}
