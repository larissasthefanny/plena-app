package services

import (
	"time"

	"github.com/larissasthefanny/plena-app/backend/internal/core/domain"
	"github.com/larissasthefanny/plena-app/backend/internal/core/ports"
)

type GoalService struct {
	goalRepo ports.GoalRepository
}

func NewGoalService(goalRepo ports.GoalRepository) *GoalService {
	return &GoalService{goalRepo: goalRepo}
}

func (s *GoalService) CreateGoal(userID int, name string, targetAmount float64, deadline time.Time) (domain.Goal, error) {
	goal := domain.Goal{
		UserID:        userID,
		Name:          name,
		TargetAmount:  targetAmount,
		CurrentAmount: 0,
		Deadline:      deadline,
		CreatedAt:     time.Now(),
	}

	id, err := s.goalRepo.Save(goal)
	if err != nil {
		return domain.Goal{}, err
	}

	goal.ID = id
	return goal, nil
}

func (s *GoalService) UpdateGoal(userID, id int, name string, targetAmount float64, deadline time.Time) error {
	goal := domain.Goal{
		ID:           id,
		UserID:       userID,
		Name:         name,
		TargetAmount: targetAmount,
		Deadline:     deadline,
	}

	return s.goalRepo.Update(goal)
}

func (s *GoalService) DeleteGoal(userID, id int) error {
	return s.goalRepo.Delete(id, userID)
}

func (s *GoalService) ListGoals(userID int) ([]domain.Goal, error) {
	return s.goalRepo.ListByUserID(userID)
}

func (s *GoalService) AddProgress(userID, goalID int, amount float64) error {
	return s.goalRepo.AddProgress(goalID, userID, amount)
}
