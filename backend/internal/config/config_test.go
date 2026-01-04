package config

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestLoad_Defaults(t *testing.T) {
	// Este teste verifica se Load() retorna uma configuração válida
	// Os valores podem vir do .env ou dos defaults
	cfg := Load()

	// Verifica que campos essenciais não estão vazios
	assert.NotEmpty(t, cfg.Port)
	assert.NotEmpty(t, cfg.DB.Host)
	// JWT_SECRET pode estar vazio se não houver .env, o que é ok para testes
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
