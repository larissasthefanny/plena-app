package handler

import (
"net/http"
"net/http/httptest"
"os"
"testing"

"github.com/stretchr/testify/assert"
"github.com/stretchr/testify/mock"
)

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

func (m *MockAuthService) LoginOrRegisterWithGoogle(email, name string) (string, error) {
	args := m.Called(email, name)
	return args.String(0), args.Error(1)
}

func TestHandleGoogleLogin_RedirectsToGoogle(t *testing.T) {
	os.Setenv("GOOGLE_CLIENT_ID", "test-client-id")
	os.Setenv("GOOGLE_CLIENT_SECRET", "test-secret")
	os.Setenv("GOOGLE_REDIRECT_URL", "http://localhost:8080/callback")
	defer os.Unsetenv("GOOGLE_CLIENT_ID")
	defer os.Unsetenv("GOOGLE_CLIENT_SECRET")
	defer os.Unsetenv("GOOGLE_REDIRECT_URL")

	mockService := new(MockAuthService)
	handler := NewOAuthHandler(mockService)

	req := httptest.NewRequest("GET", "/api/auth/google", nil)
	w := httptest.NewRecorder()

	handler.HandleGoogleLogin(w, req)

	assert.Equal(t, http.StatusTemporaryRedirect, w.Code)
	location := w.Header().Get("Location")
	assert.Contains(t, location, "accounts.google.com")
	assert.Contains(t, location, "client_id=")
}

func TestHandleGoogleCallback_MissingCode(t *testing.T) {
	os.Setenv("GOOGLE_CLIENT_ID", "test-client-id")
	os.Setenv("GOOGLE_CLIENT_SECRET", "test-secret")
	os.Setenv("GOOGLE_REDIRECT_URL", "http://localhost:8080/callback")
	os.Setenv("FRONTEND_URL", "http://localhost:3000")
	defer os.Unsetenv("GOOGLE_CLIENT_ID")
	defer os.Unsetenv("GOOGLE_CLIENT_SECRET")
	defer os.Unsetenv("GOOGLE_REDIRECT_URL")
	defer os.Unsetenv("FRONTEND_URL")

	mockService := new(MockAuthService)
	handler := NewOAuthHandler(mockService)

	req := httptest.NewRequest("GET", "/api/auth/google/callback", nil)
	w := httptest.NewRecorder()

	handler.HandleGoogleCallback(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}
