package controllers

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"

	"github.com/larissasthefanny/plena-app/backend/internal/core/domain"
)

type MockTransactionService struct {
	mock.Mock
}

func (m *MockTransactionService) CreateIncome(userID int, amount float64, category, description string, date time.Time) (domain.Transaction, error) {
	args := m.Called(userID, amount, category, description, date)
	return args.Get(0).(domain.Transaction), args.Error(1)
}

func (m *MockTransactionService) CreateExpense(userID int, amount float64, category, description string, date time.Time) (domain.Transaction, error) {
	args := m.Called(userID, amount, category, description, date)
	return args.Get(0).(domain.Transaction), args.Error(1)
}

func (m *MockTransactionService) ListTransactions(userID, month, year int) ([]domain.Transaction, error) {
	args := m.Called(userID, month, year)
	return args.Get(0).([]domain.Transaction), args.Error(1)
}

func (m *MockTransactionService) ResetData(userID int) error {
	args := m.Called(userID)
	return args.Error(0)
}

func (m *MockTransactionService) UpdateTransaction(userID, id int, amount float64, category, description string, date time.Time, typeStr string) error {
	args := m.Called(userID, id, amount, category, description, date, typeStr)
	return args.Error(0)
}

func (m *MockTransactionService) DeleteTransaction(userID, id int) error {
	args := m.Called(userID, id)
	return args.Error(0)
}

func TestCreateIncome_Controller_Success(t *testing.T) {
	mockService := new(MockTransactionService)
	controller := NewTransactionController(mockService)

	reqBody := CreateTransactionRequest{
		Amount:   100,
		Category: "Salary",
	}
	jsonBody, _ := json.Marshal(reqBody)
	req := httptest.NewRequest("POST", "/api/income", bytes.NewBuffer(jsonBody))

	ctx := context.WithValue(req.Context(), UserIDKey, 1)
	req = req.WithContext(ctx)

	w := httptest.NewRecorder()
	mockService.On("CreateIncome", 1, 100.0, "Salary", "", mock.AnythingOfType("time.Time")).Return(domain.Transaction{ID: 1, Amount: 100}, nil)

	controller.CreateIncome(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockService.AssertExpectations(t)
}

func TestCreateIncome_Controller_Unauthorized(t *testing.T) {
	mockService := new(MockTransactionService)
	controller := NewTransactionController(mockService)

	req := httptest.NewRequest("POST", "/api/income", nil)
	w := httptest.NewRecorder()

	controller.CreateIncome(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

type MockAuthService struct {
	mock.Mock
}

func (m *MockAuthService) Register(email, password string) (string, error) {
	args := m.Called(email, password)
	return args.String(0), args.Error(1)
}

func (m *MockAuthService) Login(email, password string) (string, error) {
	args := m.Called(email, password)
	return args.String(0), args.Error(1)
}

func TestLogin_Controller_Success(t *testing.T) {
	mockService := new(MockAuthService)
	controller := NewAuthController(mockService)

	reqBody := AuthRequest{Email: "test@test.com", Password: "123"}
	jsonBody, _ := json.Marshal(reqBody)
	req := httptest.NewRequest("POST", "/api/login", bytes.NewBuffer(jsonBody))
	w := httptest.NewRecorder()

	mockService.On("Login", "test@test.com", "123").Return("token123", nil)

	controller.Login(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "token123")
}
