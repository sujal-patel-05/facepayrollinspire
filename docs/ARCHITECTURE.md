# System Architecture

## Overview

The AI-Powered HRMS system follows a layered architecture separating mobile employee operations from PC-based admin operations.

## Architecture Layers

### 1. Mobile Face Capture Layer (📱 Mobile Only)

**Purpose**: Employee self-registration and attendance marking

**Components**:
- HTML5 camera interface
- Face alignment guide overlay
- Image capture and compression
- Base64 encoding for upload

**Flow**:
```
Employee → Mobile Browser → Camera API → Capture → Base64 → ngrok → Backend
```

### 2. ngrok Communication Layer

**Purpose**: Secure HTTPS tunnel for mobile-to-backend communication

**Why ngrok?**
- Mobile requires HTTPS for camera access
- Backend runs on localhost
- ngrok provides public HTTPS URL

### 3. API Gateway Layer (FastAPI)

**Purpose**: Handle all HTTP requests and route to appropriate services

**Endpoints**:
- `/auth/*` - Authentication
- `/employees/*` - Employee management
- `/attendance/*` - Attendance operations
- `/payroll/*` - Payroll calculations
- `/analytics/*` - Analytics and reporting
- `/departments/*` - Department management

**Responsibilities**:
- Request validation (Pydantic)
- JWT authentication
- Error handling
- Response formatting

### 4. AI Recognition Layer (InspireFace)

**Purpose**: Face detection, alignment, and embedding extraction

**Process**:
1. Receive image from API
2. Detect face using InspireFace detector
3. Align face for optimal recognition
4. Extract 512-D embedding vector
5. Normalize embedding

**Key Features**:
- ArcFace-based embeddings
- High accuracy (>95%)
- Fast inference (<2 seconds)

### 5. Embedding Storage Layer (SQLite)

**Purpose**: Store face embeddings as binary data

**Schema**:
```sql
employees (
    id INTEGER PRIMARY KEY,
    name TEXT,
    email TEXT,
    employee_id TEXT,
    department_id INTEGER,
    face_embedding BLOB,  -- 512-D vector as bytes
    created_at TIMESTAMP
)
```

**Why BLOB?**
- Efficient storage
- No need for separate vector database
- Simple backup/restore

### 6. Business Logic Layer (HRMS)

**Purpose**: Implement business rules and calculations

**Modules**:

#### Attendance Management
- One attendance per day validation
- Automatic department linking
- Timestamp recording
- Confidence score tracking

#### Payroll Calculation
```
Formula: Salary = Present Days × Per-Day Salary
```

- Monthly batch processing
- Department-wise aggregation
- Absent day calculation

#### Analytics Engine
- Attendance percentage
- Department-wise stats
- Monthly trends
- Absenteeism analysis
- Top performers

### 7. React UI Layer (PC Dashboards)

**Purpose**: Admin and employee interfaces

**Components**:
- Admin Dashboard (overview)
- Employee Management
- Attendance Monitor
- Payroll Management
- Analytics & Charts

**Features**:
- Framer Motion animations
- Recharts for data visualization
- React Router for navigation
- Axios for API calls

## Data Flow Diagrams

### Employee Registration Flow

```
Mobile Browser
    ↓ (Fill form + Capture face)
Camera API
    ↓ (Base64 image)
ngrok HTTPS
    ↓
FastAPI /employees/register-face
    ↓
Image Processing (validate, preprocess)
    ↓
InspireFace (extract embedding)
    ↓
SQLite (store employee + embedding)
    ↓
Response (success/failure)
    ↓
Mobile UI (show confirmation)
```

### Attendance Check-in Flow

```
Mobile Browser
    ↓ (Capture face)
Camera API
    ↓ (Base64 image)
ngrok HTTPS
    ↓
FastAPI /attendance/check-in
    ↓
InspireFace (extract embedding)
    ↓
Load all embeddings from SQLite
    ↓
Compute cosine similarity (in-memory)
    ↓
Find best match (threshold: 0.6)
    ↓
Check duplicate (one per day)
    ↓
Create attendance record
    ↓
Response (employee name, time, confidence)
    ↓
Mobile UI (show success)
```

### Payroll Calculation Flow

```
Admin Dashboard
    ↓ (Select month/year)
FastAPI /payroll/calculate-monthly
    ↓
Query all employees
    ↓
For each employee:
    Count present days (from attendance table)
    Calculate: salary = present_days × per_day_salary
    ↓
Create payroll records
    ↓
Response (summary)
    ↓
Admin Dashboard (show results)
```

## Security Architecture

### Authentication
- JWT tokens for admin access
- Password hashing with bcrypt
- Token expiration (30 minutes)

### Data Privacy
- No raw face images stored
- Only embeddings (irreversible)
- HTTPS for all mobile communication

### Access Control
- Admin endpoints require JWT
- Mobile endpoints are public (for employee use)
- Employee data isolated by department

## Scalability Considerations

### Current Design (SQLite)
- Suitable for: 100-500 employees
- Single server deployment
- Simple backup/restore

### Future Scaling
- PostgreSQL for larger datasets
- Redis for caching embeddings
- Separate face recognition service
- Load balancer for multiple API servers

## Technology Choices

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Backend | FastAPI | Fast, async, auto-docs |
| Face Recognition | InspireFace | ArcFace-based, accurate |
| Database | SQLite | Simple, embedded, sufficient |
| Frontend | React + Vite | Modern, fast, component-based |
| Mobile | HTML5 | No app installation needed |
| Communication | ngrok | Easy HTTPS tunnel |
| Charts | Recharts | React-native, customizable |
| Animation | Framer Motion | Smooth, declarative |

## Deployment Architecture

```
Production Server
    ├── Backend (gunicorn + uvicorn workers)
    ├── SQLite Database
    └── Static Files (React build)

ngrok Tunnel
    └── HTTPS → Backend

Mobile Devices
    └── Browser → ngrok → Backend

Admin PCs
    └── Browser → Static Server → Backend API
```
