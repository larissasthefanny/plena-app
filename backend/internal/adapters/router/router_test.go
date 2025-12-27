package router_test

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"

	"github.com/larissasthefanny/plena-app/backend/internal/adapters/controllers"
	"github.com/larissasthefanny/plena-app/backend/internal/adapters/router"
	"github.com/larissasthefanny/plena-app/backend/internal/core/domain"
)

type MockAuthService struct {
	mock.Mock
}

func (m *MockAuthService) Register(e, p string) (string, error) { return "token", nil }
func (m *MockAuthService) Login(e, p string) (string, error)    { return "token", nil }

type MockTransService struct {
	mock.Mock
}

func (m *MockTransService) CreateIncome(userID int, amount float64, c, d string, t time.Time) (domain.Transaction, error) {
	return domain.Transaction{}, nil
}
func (m *MockTransService) CreateExpense(userID int, amount float64, c, d string, t time.Time) (domain.Transaction, error) {
	return domain.Transaction{}, nil
}
func (m *MockTransService) ListTransactions(userID, month, year int) ([]domain.Transaction, error) {
	return []domain.Transaction{}, nil
}
func (m *MockTransService) ResetData(userID int) error { return nil }
func (m *MockTransService) UpdateTransaction(userID, id int, amount float64, category, description string, date time.Time, typeStr string) error {
	return nil
}
func (m *MockTransService) DeleteTransaction(userID, id int) error { return nil }

func TestRouter_HealthCheck(t *testing.T) {
	tc := controllers.NewTransactionController(&MockTransService{})
	ac := controllers.NewAuthController(&MockAuthService{})

	r := router.NewRouter(tc, ac)
	handler := r.Setup()

	req := httptest.NewRequest("GET", "/api/health", nil)
	w := httptest.NewRecorder()

	handler.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestRouter_AuthMiddleware_BlocksRequest(t *testing.T) {
	os.Setenv("JWT_SECRET", "testsecret")
	defer os.Unsetenv("JWT_SECRET")

	tc := controllers.NewTransactionController(&MockTransService{})
	ac := controllers.NewAuthController(&MockAuthService{})

	r := router.NewRouter(tc, ac)
	handler := r.Setup()

	req := httptest.NewRequest("GET", "/api/transactions", nil)
	w := httptest.NewRecorder()

	handler.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}
