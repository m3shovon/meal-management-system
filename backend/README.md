# Meal Management Backend - Django REST Framework

## Setup Instructions

### 1. Prerequisites
- Python 3.8+
- pip (Python package manager)

### 2. Installation

\`\`\`bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
\`\`\`

### 3. Database Setup

\`\`\`bash
# Run migrations
python manage.py migrate

# Create superuser (optional, for admin panel)
python manage.py createsuperuser
\`\`\`

### 4. Run Development Server

\`\`\`bash
python manage.py runserver
\`\`\`

The API will be available at `http://localhost:8000/api/`

### 5. Admin Panel

Access the Django admin panel at `http://localhost:8000/admin/` with your superuser credentials.

## API Endpoints

### Employees
- `GET /api/employees/` - List all employees
- `POST /api/employees/` - Create new employee
- `DELETE /api/employees/{id}/` - Delete employee

### Deposits
- `GET /api/deposits/` - List all deposits
- `POST /api/deposits/` - Create new deposit
- `DELETE /api/deposits/{id}/` - Delete deposit
- `GET /api/deposits/by_employee_month/?employee_id={id}&month={YYYY-MM}` - Get deposits for employee in month

### Meal Entries
- `GET /api/meal-entries/` - List all meal entries
- `POST /api/meal-entries/` - Create new meal entry
- `PATCH /api/meal-entries/{id}/` - Update meal entry
- `DELETE /api/meal-entries/{id}/` - Delete meal entry
- `GET /api/meal-entries/by_date/?date={YYYY-MM-DD}` - Get entries for specific date

### Meal Costs
- `GET /api/meal-costs/` - List all meal costs
- `POST /api/meal-costs/` - Create new meal cost
- `DELETE /api/meal-costs/{id}/` - Delete meal cost
- `GET /api/meal-costs/by_employee_month/?employee_id={id}&month={YYYY-MM}` - Get costs for employee in month

## Frontend Configuration

Set the API URL in your frontend environment variables:

\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:8000/api
\`\`\`

For production, update this to your deployed backend URL.

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000`
- `http://localhost:8000`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:8000`

Update `config/settings.py` `CORS_ALLOWED_ORIGINS` for production URLs.
