package services

import (
	"testing"
	"time"

	"github.com/larissasthefanny/plena-app/backend/internal/core/domain"
	"github.com/stretchr/testify/assert"
)

type MockGoalRepository struct {
	goals []domain.Goal
}

func (m *MockGoalRepository) Save(goal domain.Goal) (int, error) {
	goal.ID = len(m.goals) + 1
	m.goals = append(m.goals, goal)
	return goal.ID, nil
}

func (m *MockGoalRepository) Update(goal domain.Goal) error {
	for i, g := range m.goals {
		if g.ID == goal.ID && g.UserID == goal.UserID {
			m.goals[i] = goal
			return nil
		}
	}
	return nil
}

func (m *MockGoalRepository) Delete(id, userID int) error {
	for i, g := range m.goals {
		if g.ID == id && g.UserID == userID {
			m.goals = append(m.goals[:i], m.goals[i+1:]...)
			return nil
		}
	}
	return nil
}

func (m *MockGoalRepository) ListByUserID(userID int) ([]domain.Goal, error) {
	var result []domain.Goal
	for _, g := range m.goals {
		if g.UserID == userID {
			result = append(result, g)
		}
	}
	return result, nil
}

func (m *MockGoalRepository) GetByID(id, userID int) (domain.Goal, error) {
	for _, g := range m.goals {
		if g.ID == id && g.UserID == userID {
			return g, nil
		}
	}
	return domain.Goal{}, nil
}

func (m *MockGoalRepository) AddProgress(id, userID int, amount float64) error {
	for i, g := range m.goals {
		if g.ID == id && g.UserID == userID {
			m.goals[i].CurrentAmount += amount
			return nil
		}
	}
	return nil
}

func TestCreateGoal(t *testing.T) {
	repo := &MockGoalRepository{}
	service := NewGoalService(repo)

	deadline := time.Now().AddDate(0, 6, 0)
	goal, err := service.CreateGoal(1, "Viagem", 5000.0, deadline)

	assert.NoError(t, err)
	assert.Equal(t, "Viagem", goal.Name)
	assert.Equal(t, 5000.0, goal.TargetAmount)
	assert.Equal(t, 0.0, goal.CurrentAmount)
	assert.Equal(t, 1, goal.UserID)
}

func TestListGoals(t *testing.T) {
	repo := &MockGoalRepository{}
	service := NewGoalService(repo)

	deadline := time.Now().AddDate(0, 6, 0)
	service.CreateGoal(1, "Viagem", 5000.0, deadline)
	service.CreateGoal(1, "Carro", 30000.0, deadline)
	service.CreateGoal(2, "Casa", 100000.0, deadline)

	goals, err := service.ListGoals(1)

	assert.NoError(t, err)
	assert.Len(t, goals, 2)
}

func TestUpdateGoal(t *testing.T) {
	repo := &MockGoalRepository{}
	service := NewGoalService(repo)

	deadline := time.Now().AddDate(0, 6, 0)
	goal, _ := service.CreateGoal(1, "Viagem", 5000.0, deadline)

	newDeadline := time.Now().AddDate(1, 0, 0)
	err := service.UpdateGoal(1, goal.ID, "Viagem Europa", 8000.0, newDeadline)

	assert.NoError(t, err)

	goals, _ := service.ListGoals(1)
	assert.Equal(t, "Viagem Europa", goals[0].Name)
	assert.Equal(t, 8000.0, goals[0].TargetAmount)
}

func TestDeleteGoal(t *testing.T) {
	repo := &MockGoalRepository{}
	service := NewGoalService(repo)

	deadline := time.Now().AddDate(0, 6, 0)
	goal, _ := service.CreateGoal(1, "Viagem", 5000.0, deadline)

	err := service.DeleteGoal(1, goal.ID)
	assert.NoError(t, err)

	goals, _ := service.ListGoals(1)
	assert.Len(t, goals, 0)
}

func TestAddProgress(t *testing.T) {
	repo := &MockGoalRepository{}
	service := NewGoalService(repo)

	deadline := time.Now().AddDate(0, 6, 0)
	goal, _ := service.CreateGoal(1, "Viagem", 5000.0, deadline)

	err := service.AddProgress(1, goal.ID, 1000.0)
	assert.NoError(t, err)

	goals, _ := service.ListGoals(1)
	assert.Equal(t, 1000.0, goals[0].CurrentAmount)

	// Add more progress
	service.AddProgress(1, goal.ID, 500.0)
	goals, _ = service.ListGoals(1)
	assert.Equal(t, 1500.0, goals[0].CurrentAmount)
}
