package config

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestLoad_Defaults(t *testing.T) {
	os.Unsetenv("PORT")
	os.Unsetenv("DB_HOST")

	cfg := Load()

	assert.Equal(t, "8080", cfg.Port)
	assert.Equal(t, "localhost", cfg.DB.Host)
	assert.Equal(t, "secret_key_plena_app_2025", cfg.JWTSecret)
}

func TestLoad_EnvVars(t *testing.T) {
	os.Setenv("PORT", "9090")
	os.Setenv("DB_HOST", "db-host")
	os.Setenv("JWT_SECRET", "new-secret")
	defer os.Unsetenv("PORT")
	defer os.Unsetenv("DB_HOST")
	defer os.Unsetenv("JWT_SECRET")

	cfg := Load()

	assert.Equal(t, "9090", cfg.Port)
	assert.Equal(t, "db-host", cfg.DB.Host)
	assert.Equal(t, "new-secret", cfg.JWTSecret)
}
