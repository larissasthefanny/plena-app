package router

import (
	"net/http"
	"strings"

	"github.com/larissasthefanny/plena-app/backend/internal/adapters/controllers"
	"github.com/larissasthefanny/plena-app/backend/internal/config"
)

type Router struct {
	transController *controllers.TransactionController
	authController  *controllers.AuthController
	goalController  *controllers.GoalController
	config          *config.AppConfig
}

func NewRouter(tc *controllers.TransactionController, ac *controllers.AuthController, gc *controllers.GoalController, cfg *config.AppConfig) *Router {
	return &Router{
		transController: tc,
		authController:  ac,
		goalController:  gc,
		config:          cfg,
	}
}

func (router *Router) Setup() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/health", router.transController.HealthCheck)
	mux.HandleFunc("/api/register", router.authController.Register)
	mux.HandleFunc("/api/login", router.authController.Login)

	mux.HandleFunc("/api/income", controllers.AuthMiddleware(router.transController.CreateIncome))
	mux.HandleFunc("/api/expense", controllers.AuthMiddleware(router.transController.CreateExpense))
	mux.HandleFunc("/api/transactions", controllers.AuthMiddleware(router.transController.ListTransactions))
	mux.HandleFunc("/api/reset", controllers.AuthMiddleware(router.transController.ResetData))

	mux.HandleFunc("DELETE /api/transactions/{id}", controllers.AuthMiddleware(router.transController.DeleteTransaction))
	mux.HandleFunc("PUT /api/transactions/{id}", controllers.AuthMiddleware(router.transController.UpdateTransaction))

	// Goal routes
	mux.HandleFunc("POST /api/goals", controllers.AuthMiddleware(router.goalController.CreateGoal))
	mux.HandleFunc("GET /api/goals", controllers.AuthMiddleware(router.goalController.ListGoals))
	mux.HandleFunc("PUT /api/goals/{id}", controllers.AuthMiddleware(router.goalController.UpdateGoal))
	mux.HandleFunc("DELETE /api/goals/{id}", controllers.AuthMiddleware(router.goalController.DeleteGoal))
	mux.HandleFunc("POST /api/goals/{id}/progress", controllers.AuthMiddleware(router.goalController.AddProgress))

	return router.enableCORS(mux)
}

func (router *Router) enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		allowOrigin := false

		for _, allowedOrigin := range router.config.AllowedOrigins {
			if allowedOrigin == "*" {
				allowOrigin = true
				break
			} else if strings.Contains(allowedOrigin, "*") {
				parts := strings.Split(allowedOrigin, "*")
				if len(parts) == 2 {
					prefix := parts[0]
					suffix := parts[1]
					if strings.HasPrefix(origin, prefix) && strings.HasSuffix(origin, suffix) {
						allowOrigin = true
						break
					}
				}
			} else if origin == allowedOrigin {
				allowOrigin = true
				break
			}
		}

		if allowOrigin {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
		}
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
