#!/bin/bash
# ═══════════════════════════════════════════
# VELVET ROAST — Quick Start Script
# Usage: chmod +x setup.sh && ./setup.sh
# ═══════════════════════════════════════════

set -e

GREEN='\033[0;32m'
GOLD='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${GOLD}☕  VELVET ROAST — Setup${NC}"
echo "=================================="

# Check Node.js
if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js not found. Please install Node.js 18+ first.${NC}"
  exit 1
fi

NODE_VER=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VER" -lt 18 ]; then
  echo -e "${RED}✗ Node.js 18+ required. You have $(node -v).${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v) detected${NC}"

# Install frontend deps
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

# Install backend deps
echo ""
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Copy .env files if they don't exist
echo ""
if [ ! -f "frontend/.env" ]; then
  cp frontend/.env.example frontend/.env
  echo -e "${GOLD}⚠  Created frontend/.env — please add your Supabase keys${NC}"
else
  echo -e "${GREEN}✓ frontend/.env already exists${NC}"
fi

if [ ! -f "backend/.env" ]; then
  cp backend/.env.example backend/.env
  echo -e "${GOLD}⚠  Created backend/.env — please add your Supabase keys${NC}"
else
  echo -e "${GREEN}✓ backend/.env already exists${NC}"
fi

echo ""
echo "=================================="
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Add your Supabase credentials to frontend/.env and backend/.env"
echo "  2. Run the SQL in README.md to create your database tables"
echo "  3. Start the app:"
echo ""
echo -e "     ${GOLD}Terminal 1:${NC} cd backend && npm run dev"
echo -e "     ${GOLD}Terminal 2:${NC} cd frontend && npm run dev"
echo ""
echo -e "  Frontend: ${GOLD}http://localhost:5173${NC}"
echo -e "  Backend:  ${GOLD}http://localhost:4000${NC}"
echo ""
