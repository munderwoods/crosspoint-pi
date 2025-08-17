# Default target shows help
.DEFAULT_GOAL := help

.PHONY: install dev start server build test clean image help

# Install dependencies
install:
	npm install

# Start development server (React frontend)
dev:
	npm start

# Alternative alias for dev
start: dev

# Start backend server
server:
	npm run server

# Build the application
build:
	npm run build

# Run tests
test:
	npm test

# Clean build artifacts
clean:
	rm -rf build/ node_modules/

# Build Raspberry Pi image (requires Docker)
image:
	npm run image

# Show available targets
help:
	@echo "Available targets:"
	@echo "  install  - Install npm dependencies"
	@echo "  dev      - Start React development server (port 3000)"
	@echo "  start    - Alias for dev"
	@echo "  server   - Start Express backend server (port 3001)"
	@echo "  build    - Build React app and compile server"
	@echo "  test     - Run React test suite"
	@echo "  clean    - Remove build artifacts and node_modules"
	@echo "  image    - Build Raspberry Pi image using Packer"
	@echo "  help     - Show this help message"