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

	if dbURL := getEnv("DATABASE_URL", ""); dbURL != "" {
		log.Printf("Using DATABASE_URL: %s", dbURL)
		return parseDatabaseURL(dbURL)
	}

	log.Println("Using individual DB environment variables")
	dbPort, _ := strconv.Atoi(getEnv("DB_PORT", "5432"))

	return &AppConfig{
		DB: DBConfig{
			Host:     getEnv("DB_HOST", "127.0.0.1"),
			Port:     dbPort,
			User:     getEnv("DB_USER", "plena_user"),
			Password: getEnv("DB_PASSWORD", "plena_password"),
			Name:     getEnv("DB_NAME", "plena_db"),
		},
		Port:      getEnv("PORT", "8080"),
		JWTSecret: getEnv("JWT_SECRET", ""),
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

	// Extract password from URL
	password, _ := parsedURL.User.Password()

	// Extract port from host
	host := parsedURL.Hostname()
	portStr := parsedURL.Port()
	if portStr == "" {
		portStr = "5432" // Default PostgreSQL port
	}
	port, _ := strconv.Atoi(portStr)

	// Extract database name from path
	dbName := strings.TrimPrefix(parsedURL.Path, "/")
	if dbName == "" {
		dbName = "postgres" // Default database name
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
		JWTSecret: getEnv("JWT_SECRET", "secret_key_plena_app_2025"),
	}
}
