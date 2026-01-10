#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Running migrations..."
php artisan migrate --force

echo "Running seeders..."
php artisan db:seed --force

echo "Starting Apache..."
exec apache2-foreground
