package repository_test

import (
	"database/sql"
	"os"
	"testing"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/stretchr/testify/assert"

	"github.com/larissasthefanny/plena-app/backend/internal/adapters/clients/database"
	"github.com/larissasthefanny/plena-app/backend/internal/adapters/repository"
	"github.com/larissasthefanny/plena-app/backend/internal/core/domain"
)

func setupTestDB(t *testing.T) *sql.DB {
	_ = godotenv.Load("../../../../.env")

	dbConfig := database.Config{
		Host:     "localhost",
		Port:     5432,
		User:     "plena_user",
		Password: "plena_password",
		DBName:   "plena_db", // Using main DB for this example, be careful!
	}

	db, err := database.NewPostgresConnection(dbConfig)
	if err != nil {
		t.Skip("Skipping integration test: Could not connect to database")
	}
	return db
}

func TestPostgresTransactionRepository_Integration(t *testing.T) {
	if os.Getenv("CI") != "" {
		t.Skip("Skipping integration test in CI environment")
	}

	db := setupTestDB(t)
	defer db.Close()

	repo := repository.NewPostgresTransactionRepository(db)
	testUserID := 9999

	defer func() {
		repo.DeleteAllByUserID(testUserID)
	}()
	t.Run("Save Transaction", func(t *testing.T) {
		tr := domain.Transaction{
			UserID:      testUserID,
			Type:        "income",
			Amount:      100.50,
			Category:    "TestCat",
			Description: "Test Desc",
			Date:        time.Now(),
		}

		id, err := repo.Save(tr)
		assert.NoError(t, err)
		assert.Greater(t, id, 0)
	})

	t.Run("List Transactions", func(t *testing.T) {
		tr2 := domain.Transaction{
			UserID:      testUserID,
			Type:        "expense",
			Amount:      50.00,
			Category:    "TestCat2",
			Description: "Test Desc 2",
			Date:        time.Now(),
		}
		repo.Save(tr2)

		list, err := repo.ListByUserID(testUserID)
		assert.NoError(t, err)
		assert.Len(t, list, 2)

		assert.Equal(t, "expense", list[0].Type)
	})

	t.Run("Delete All", func(t *testing.T) {
		err := repo.DeleteAllByUserID(testUserID)
		assert.NoError(t, err)

		list, err := repo.ListByUserID(testUserID)
		assert.NoError(t, err)
		assert.Len(t, list, 0)
	})
}
