package controllers

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/larissasthefanny/plena-app/backend/internal/core/domain"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockGoalService struct {
	mock.Mock
}

func (m *MockGoalService) CreateGoal(userID int, name string, targetAmount float64, deadline time.Time) (domain.Goal, error) {
	args := m.Called(userID, name, targetAmount, deadline)
	return args.Get(0).(domain.Goal), args.Error(1)
}

func (m *MockGoalService) UpdateGoal(userID, id int, name string, targetAmount float64, deadline time.Time) error {
	args := m.Called(userID, id, name, targetAmount, deadline)
	return args.Error(0)
}

func (m *MockGoalService) DeleteGoal(userID, id int) error {
	args := m.Called(userID, id)
	return args.Error(0)
}

func (m *MockGoalService) ListGoals(userID int) ([]domain.Goal, error) {
	args := m.Called(userID)
	return args.Get(0).([]domain.Goal), args.Error(1)
}

func (m *MockGoalService) AddProgress(userID, goalID int, amount float64) error {
	args := m.Called(userID, goalID, amount)
	return args.Error(0)
}

func TestCreateGoal_Controller_Success(t *testing.T) {
	mockService := new(MockGoalService)
	controller := NewGoalController(mockService)

	deadline := time.Now().AddDate(0, 6, 0)
	expectedGoal := domain.Goal{
		ID:            1,
		UserID:        1,
		Name:          "Viagem",
		TargetAmount:  5000.0,
		CurrentAmount: 0,
		Deadline:      deadline,
		CreatedAt:     time.Now(),
	}

	mockService.On("CreateGoal", 1, "Viagem", 5000.0, mock.AnythingOfType("time.Time")).
		Return(expectedGoal, nil)

	reqBody := map[string]interface{}{
		"name":          "Viagem",
		"target_amount": 5000.0,
		"deadline":      deadline.Format(time.RFC3339),
	}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest("POST", "/api/goals", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	ctx := context.WithValue(req.Context(), UserIDKey, 1)
	req = req.WithContext(ctx)

	w := httptest.NewRecorder()

	controller.CreateGoal(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response domain.Goal
	json.Unmarshal(w.Body.Bytes(), &response)
	assert.Equal(t, "Viagem", response.Name)
	assert.Equal(t, 5000.0, response.TargetAmount)

	mockService.AssertExpectations(t)
}

func TestCreateGoal_Controller_Unauthorized(t *testing.T) {
	mockService := new(MockGoalService)
	controller := NewGoalController(mockService)

	req := httptest.NewRequest("POST", "/api/goals", nil)
	w := httptest.NewRecorder()

	controller.CreateGoal(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestListGoals_Controller_Success(t *testing.T) {
	mockService := new(MockGoalService)
	controller := NewGoalController(mockService)

	deadline := time.Now().AddDate(0, 6, 0)
	expectedGoals := []domain.Goal{
		{
			ID:            1,
			UserID:        1,
			Name:          "Viagem",
			TargetAmount:  5000.0,
			CurrentAmount: 1000.0,
			Deadline:      deadline,
		},
		{
			ID:            2,
			UserID:        1,
			Name:          "Carro",
			TargetAmount:  30000.0,
			CurrentAmount: 5000.0,
			Deadline:      deadline,
		},
	}

	mockService.On("ListGoals", 1).Return(expectedGoals, nil)

	req := httptest.NewRequest("GET", "/api/goals", nil)
	ctx := context.WithValue(req.Context(), UserIDKey, 1)
	req = req.WithContext(ctx)

	w := httptest.NewRecorder()

	controller.ListGoals(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response []domain.Goal
	json.Unmarshal(w.Body.Bytes(), &response)
	assert.Len(t, response, 2)
	assert.Equal(t, "Viagem", response[0].Name)
	assert.Equal(t, "Carro", response[1].Name)

	mockService.AssertExpectations(t)
}

func TestUpdateGoal_Controller_Success(t *testing.T) {
	mockService := new(MockGoalService)
	controller := NewGoalController(mockService)

	deadline := time.Now().AddDate(1, 0, 0)

	mockService.On("UpdateGoal", 1, 1, "Viagem Europa", 8000.0, mock.AnythingOfType("time.Time")).
		Return(nil)

	reqBody := map[string]interface{}{
		"name":          "Viagem Europa",
		"target_amount": 8000.0,
		"deadline":      deadline.Format(time.RFC3339),
	}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest("PUT", "/api/goals/1", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.SetPathValue("id", "1")
	ctx := context.WithValue(req.Context(), UserIDKey, 1)
	req = req.WithContext(ctx)

	w := httptest.NewRecorder()

	controller.UpdateGoal(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	mockService.AssertExpectations(t)
}

func TestDeleteGoal_Controller_Success(t *testing.T) {
	mockService := new(MockGoalService)
	controller := NewGoalController(mockService)

	mockService.On("DeleteGoal", 1, 1).Return(nil)

	req := httptest.NewRequest("DELETE", "/api/goals/1", nil)
	req.SetPathValue("id", "1")
	ctx := context.WithValue(req.Context(), UserIDKey, 1)
	req = req.WithContext(ctx)

	w := httptest.NewRecorder()

	controller.DeleteGoal(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	mockService.AssertExpectations(t)
}

func TestAddProgress_Controller_Success(t *testing.T) {
	mockService := new(MockGoalService)
	controller := NewGoalController(mockService)

	mockService.On("AddProgress", 1, 1, 500.0).Return(nil)

	reqBody := map[string]interface{}{
		"amount": 500.0,
	}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest("POST", "/api/goals/1/progress", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.SetPathValue("id", "1")
	ctx := context.WithValue(req.Context(), UserIDKey, 1)
	req = req.WithContext(ctx)

	w := httptest.NewRecorder()

	controller.AddProgress(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	mockService.AssertExpectations(t)
}
