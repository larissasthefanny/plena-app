package services

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"github.com/larissasthefanny/plena-app/backend/internal/core/domain"
	"github.com/larissasthefanny/plena-app/backend/internal/core/ports"
)

type AuthService struct {
	userRepo  ports.UserRepository
	jwtSecret []byte
}

func NewAuthService(userRepo ports.UserRepository, jwtSecret string) *AuthService {
	return &AuthService{
		userRepo:  userRepo,
		jwtSecret: []byte(jwtSecret),
	}
}

type Claims struct {
	UserID int `json:"user_id"`
	jwt.RegisteredClaims
}

func (s *AuthService) Register(email, password string) (string, error) {
	_, err := s.userRepo.GetByEmail(email)
	if err == nil {
		return "", errors.New("email already registered")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	user := domain.User{
		Email:    email,
		Password: string(hashedPassword),
	}

	id, err := s.userRepo.Save(user)
	if err != nil {
		return "", err
	}

	return s.generateToken(id)
}

func (s *AuthService) Login(email, password string) (string, error) {
	user, err := s.userRepo.GetByEmail(email)
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	return s.generateToken(user.ID)
}

func (s *AuthService) generateToken(userID int) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.jwtSecret)
}
