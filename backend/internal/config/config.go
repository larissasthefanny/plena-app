package config

import (
	"log"
	"net/url"
	"os"
	"strconv"
	"strings"

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

	if dbURL := getEnv("DB_HOST", ""); dbURL != "" {
		return parseDatabaseURL(dbURL)
	}

	dbPort, _ := strconv.Atoi(getEnv("DB_PORT", "5432"))

	return &AppConfig{
		DB: DBConfig{
			Host:     getEnv("DB_HOST", ""),
			Port:     dbPort,
			User:     getEnv("DB_USER", ""),
			Password: getEnv("DB_PASSWORD", ""),
			Name:     getEnv("DB_NAME", ""),
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

func parseDatabaseURL(dbURL string) *AppConfig {
	parsedURL, err := url.Parse(dbURL)
	if err != nil {
		log.Fatalf("Invalid DATABASE_URL: %v", err)
	}

	password, _ := parsedURL.User.Password()

	host := parsedURL.Hostname()
	portStr := parsedURL.Port()
	if portStr == "" {
		portStr = "5432"
	}
	port, _ := strconv.Atoi(portStr)

	dbName := strings.TrimPrefix(parsedURL.Path, "/")
	if dbName == "" {
		dbName = "postgres"
	}

	return &AppConfig{
		DB: DBConfig{
			Host:     host,
			Port:     port,
			User:     parsedURL.User.Username(),
			Password: password,
			Name:     dbName,
		},
		Port:      getEnv("PORT", "8080"),
		JWTSecret: getEnv("JWT_SECRET", ""),
	}
}
