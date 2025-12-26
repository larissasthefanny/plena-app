package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type DBConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	Name     string
}

type AppConfig struct {
	DB        DBConfig
	Port      string
	JWTSecret string
}

func Load() *AppConfig {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found or error loading it, using system environment variables")
	}

	dbPort, _ := strconv.Atoi(getEnv("DB_PORT", "5432"))

	return &AppConfig{
		DB: DBConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     dbPort,
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", "postgres"),
			Name:     getEnv("DB_NAME", "plena_db"),
		},
		Port:      getEnv("PORT", "8080"),
		JWTSecret: getEnv("JWT_SECRET", "secret_key_plena_app_2025"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
