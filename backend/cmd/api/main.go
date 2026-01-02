package main

import (
	"log"
	"net/http"

	"github.com/larissasthefanny/plena-app/backend/internal/adapters/clients/database"
	"github.com/larissasthefanny/plena-app/backend/internal/adapters/controllers"
	"github.com/larissasthefanny/plena-app/backend/internal/adapters/repository"
	"github.com/larissasthefanny/plena-app/backend/internal/adapters/router"
	"github.com/larissasthefanny/plena-app/backend/internal/config"
	"github.com/larissasthefanny/plena-app/backend/internal/core/services"
)

func main() {
	cfg := config.Load()

	dbConfig := database.Config{
		Host:     cfg.DB.Host,
		Port:     cfg.DB.Port,
		User:     cfg.DB.User,
		Password: cfg.DB.Password,
		DBName:   cfg.DB.Name,
	}
	dbConnection, err := database.NewPostgresConnection(dbConfig)
	if err != nil {
		log.Fatalf("Could not connect to database: %v", err)
	}
	defer dbConnection.Close()

	transactionRepo := repository.NewPostgresTransactionRepository(dbConnection)
	userRepo := repository.NewPostgresUserRepository(dbConnection)
	goalRepo := repository.NewPostgresGoalRepository(dbConnection)

	transactionService := services.NewTransactionService(transactionRepo)
	authService := services.NewAuthService(userRepo, cfg.JWTSecret)
	goalService := services.NewGoalService(goalRepo)

	transController := controllers.NewTransactionController(transactionService)
	authController := controllers.NewAuthController(authService)
	goalController := controllers.NewGoalController(goalService)

	appRouter := router.NewRouter(transController, authController, goalController, cfg)
	handler := appRouter.Setup()

	log.Printf("Server starting on port %s...", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, handler); err != nil {
		log.Fatal(err)
	}
}
