package router

import (
	"net/http"

	"github.com/larissasthefanny/plena-app/backend/internal/adapters/controllers"
)

type Router struct {
	transController *controllers.TransactionController
	authController  *controllers.AuthController
}

func NewRouter(tc *controllers.TransactionController, ac *controllers.AuthController) *Router {
	return &Router{
		transController: tc,
		authController:  ac,
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

	return router.enableCORS(mux)
}

func (router *Router) enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if r.Method == "OPTIONS" {
			return
		}

		next.ServeHTTP(w, r)
	})
}
