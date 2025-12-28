package domain

import "time"

type Goal struct {
	ID            int       `json:"id"`
	UserID        int       `json:"user_id"`
	Name          string    `json:"name"`
	TargetAmount  float64   `json:"target_amount"`
	CurrentAmount float64   `json:"current_amount"`
	Deadline      time.Time `json:"deadline"`
	CreatedAt     time.Time `json:"created_at"`
}
