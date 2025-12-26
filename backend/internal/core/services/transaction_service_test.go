package services_test

import (
	"errors"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"

	"github.com/larissasthefanny/plena-app/backend/internal/core/domain"
	"github.com/larissasthefanny/plena-app/backend/internal/core/services"
)

type MockTransactionRepository struct {
	mock.Mock
}

func (m *MockTransactionRepository) Save(transaction domain.Transaction) (int, error) {
	args := m.Called(transaction)
	return args.Int(0), args.Error(1)
}

func (m *MockTransactionRepository) ListByUserID(userID int) ([]domain.Transaction, error) {
	args := m.Called(userID)
	return args.Get(0).([]domain.Transaction), args.Error(1)
}

func (m *MockTransactionRepository) DeleteAllByUserID(userID int) error {
	args := m.Called(userID)
	return args.Error(0)
}

func TestCreateIncome_Success(t *testing.T) {
	mockRepo := new(MockTransactionRepository)
	service := services.NewTransactionService(mockRepo)

	userID := 1
	amount := 5000.0
	category := "Salário"
	description := "Pagamento mensal"
	date := time.Now()

	expectedID := 100

	mockRepo.On("Save", mock.AnythingOfType("domain.Transaction")).Return(expectedID, nil)

	result, err := service.CreateIncome(userID, amount, category, description, date)

	assert.NoError(t, err)
	assert.Equal(t, expectedID, result.ID)
	assert.Equal(t, "income", result.Type)
	assert.Equal(t, amount, result.Amount)

	mockRepo.AssertCalled(t, "Save", mock.MatchedBy(func(tr domain.Transaction) bool {
		return tr.UserID == userID && tr.Type == "income" && tr.Amount == amount
	}))
}

func TestCreateExpense_Success(t *testing.T) {
	mockRepo := new(MockTransactionRepository)
	service := services.NewTransactionService(mockRepo)

	userID := 1
	amount := 150.0
	category := "Essenciais"
	description := "Conta de Luz"
	date := time.Now()

	expectedID := 101

	mockRepo.On("Save", mock.AnythingOfType("domain.Transaction")).Return(expectedID, nil)

	result, err := service.CreateExpense(userID, amount, category, description, date)

	assert.NoError(t, err)
	assert.Equal(t, expectedID, result.ID)
	assert.Equal(t, "expense", result.Type)

	mockRepo.AssertCalled(t, "Save", mock.MatchedBy(func(tr domain.Transaction) bool {
		return tr.UserID == userID && tr.Type == "expense"
	}))
}

func TestListTransactions_Success(t *testing.T) {
	mockRepo := new(MockTransactionRepository)
	service := services.NewTransactionService(mockRepo)
	userID := 1

	expectedTransactions := []domain.Transaction{
		{ID: 1, Type: "income", Amount: 1000},
		{ID: 2, Type: "expense", Amount: 200},
	}

	mockRepo.On("ListByUserID", userID).Return(expectedTransactions, nil)

	result, err := service.ListTransactions(userID)

	assert.NoError(t, err)
	assert.Len(t, result, 2)
	assert.Equal(t, expectedTransactions, result)
}

func TestListTransactions_Error(t *testing.T) {
	mockRepo := new(MockTransactionRepository)
	service := services.NewTransactionService(mockRepo)
	userID := 1

	mockRepo.On("ListByUserID", userID).Return([]domain.Transaction(nil), errors.New("db error"))

	_, err := service.ListTransactions(userID)

	assert.Error(t, err)
	assert.EqualError(t, err, "db error")
}
