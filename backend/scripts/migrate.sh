
echo "🔄 Running database migrations..."

cd "$(dirname "$0")/.."

if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL environment variable is not set"
    echo "Please set it like: export DATABASE_URL='postgresql://user:password@host:port/dbname'"
    exit 1
fi

go run cmd/migrate/main.go

if [ $? -eq 0 ]; then
    echo "Migrations completed successfully!"
else
    echo "Migration failed!"
    exit 1
fi
