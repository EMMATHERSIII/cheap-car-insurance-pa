#!/bin/bash

###############################################################################
# Database Export Script
# Exports all data from current database for migration to Hostinger
###############################################################################

set -e

echo "========================================="
echo "Database Export Script"
echo "========================================="
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Error: .env file not found!"
    echo "Please ensure your .env file exists with DATABASE_URL"
    exit 1
fi

# Load DATABASE_URL from .env
export $(grep -v '^#' .env | xargs)

if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL not found in .env"
    exit 1
fi

# Parse DATABASE_URL
# Format: mysql://user:password@host:port/database
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

echo "Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Create export directory
EXPORT_DIR="database-export-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$EXPORT_DIR"

echo "Exporting database to: $EXPORT_DIR"
echo ""

# Export schema
echo "Exporting database schema..."
mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" \
    --no-data \
    --skip-add-drop-table \
    "$DB_NAME" > "$EXPORT_DIR/schema.sql" 2>/dev/null || {
    echo "Note: mysqldump not available or connection failed"
    echo "Using drizzle schema instead..."
    cp drizzle/schema.ts "$EXPORT_DIR/schema.ts"
}

# Export data
echo "Exporting database data..."
mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" \
    --no-create-info \
    --skip-extended-insert \
    "$DB_NAME" > "$EXPORT_DIR/data.sql" 2>/dev/null || {
    echo "Note: mysqldump not available - data export skipped"
    echo "Please export data manually from Manus Database panel"
}

# Export individual tables as CSV (if mysql client is available)
if command -v mysql &> /dev/null; then
    echo "Exporting individual tables as CSV..."
    
    TABLES=("users" "leads" "blog_posts" "contact_messages" "ab_test_variants" "ab_test_events")
    
    for table in "${TABLES[@]}"; do
        echo "  - Exporting $table..."
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" \
            -D "$DB_NAME" \
            -e "SELECT * FROM $table" \
            --batch --silent \
            | sed 's/\t/,/g' > "$EXPORT_DIR/${table}.csv" 2>/dev/null || {
            echo "    Warning: Could not export $table"
        }
    done
fi

# Create import script for Hostinger
cat > "$EXPORT_DIR/import-to-hostinger.sh" << 'EOF'
#!/bin/bash

# Import Script for Hostinger
# Run this script on your Hostinger server after uploading the export files

echo "========================================="
echo "Database Import Script for Hostinger"
echo "========================================="
echo ""

# Prompt for database credentials
read -p "Enter MySQL database name: " DB_NAME
read -p "Enter MySQL username: " DB_USER
read -sp "Enter MySQL password: " DB_PASS
echo ""

# Import schema
if [ -f "schema.sql" ]; then
    echo "Importing database schema..."
    mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < schema.sql
    echo "✓ Schema imported"
fi

# Import data
if [ -f "data.sql" ]; then
    echo "Importing database data..."
    mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < data.sql
    echo "✓ Data imported"
fi

echo ""
echo "Import complete!"
echo "Please verify your data in phpMyAdmin"
EOF

chmod +x "$EXPORT_DIR/import-to-hostinger.sh"

# Create archive
tar -czf "${EXPORT_DIR}.tar.gz" "$EXPORT_DIR"

echo ""
echo "========================================="
echo "Export Complete!"
echo "========================================="
echo ""
echo "Exported files:"
echo "  - Archive: ${EXPORT_DIR}.tar.gz"
echo "  - Directory: $EXPORT_DIR/"
echo ""
echo "Next steps:"
echo "  1. Download ${EXPORT_DIR}.tar.gz"
echo "  2. Upload to your Hostinger server"
echo "  3. Extract: tar -xzf ${EXPORT_DIR}.tar.gz"
echo "  4. Run: cd $EXPORT_DIR && ./import-to-hostinger.sh"
echo ""
