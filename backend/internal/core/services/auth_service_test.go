package services_test

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"golang.org/x/crypto/bcrypt"

	"github.com/larissasthefanny/plena-app/backend/internal/core/domain"
	"github.com/larissasthefanny/plena-app/backend/internal/core/services"
)

type MockUserRepository struct {
	mock.Mock
}

func (m *MockUserRepository) Save(user domain.User) (int, error) {
	args := m.Called(user)
	return args.Int(0), args.Error(1)
}

func (m *MockUserRepository) GetByEmail(email string) (domain.User, error) {
	args := m.Called(email)
	return args.Get(0).(domain.User), args.Error(1)
}

func TestRegister_Success(t *testing.T) {
	mockRepo := new(MockUserRepository)
	secret := "mysecret"
	service := services.NewAuthService(mockRepo, secret)

	email := "test@example.com"
	password := "password123"

	mockRepo.On("GetByEmail", email).Return(domain.User{}, errors.New("user not found"))

	mockRepo.On("Save", mock.MatchedBy(func(u domain.User) bool {
		return u.Email == email && u.Password != password
	})).Return(1, nil)

	token, err := service.Register(email, password)

	assert.NoError(t, err)
	assert.NotEmpty(t, token)
}

func TestRegister_DuplicateEmail(t *testing.T) {
	mockRepo := new(MockUserRepository)
	secret := "mysecret"
	service := services.NewAuthService(mockRepo, secret)

	email := "existing@example.com"
	password := "password123"

	mockRepo.On("GetByEmail", email).Return(domain.User{ID: 1, Email: email}, nil)

	token, err := service.Register(email, password)

	assert.Error(t, err)
	assert.Empty(t, token)
	assert.Equal(t, "email already registered", err.Error())
}

func TestLogin_Success(t *testing.T) {
	mockRepo := new(MockUserRepository)
	secret := "mysecret"
	service := services.NewAuthService(mockRepo, secret)

	email := "test@example.com"
	password := "password123"
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	mockRepo.On("GetByEmail", email).Return(domain.User{ID: 1, Email: email, Password: string(hashedPassword)}, nil)

	token, err := service.Login(email, password)

	assert.NoError(t, err)
	assert.NotEmpty(t, token)
}
