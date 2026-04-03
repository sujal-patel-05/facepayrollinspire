# Mermaid Diagrams for Academic Report

All diagrams for the AI-Powered Face Recognition HRMS Academic Report.

---

## Figure 1.1: Overall System Architecture Diagram

```mermaid
graph TB
    subgraph Presentation["Presentation Layer"]
        direction LR
        subgraph Mobile["Mobile Client (HTML5 + JS)"]
            M1["📱 Registration"]
            M2["📱 Attendance"]
            M3["📱 Camera API"]
        end
        subgraph Admin["Admin Dashboard (React.js + Vite)"]
            A1["👤 Employee Management"]
            A2["📋 Attendance Monitor"]
            A3["💰 Payroll Calculation"]
            A4["📊 Analytics Dashboard"]
        end
    end

    subgraph Application["Application Layer — FastAPI Backend (Python)"]
        AUTH["🔐 Auth (JWT)"]
        EMP["👥 Employees"]
        ATT["📋 Attendance"]
        PAY["💰 Payroll & Analytics"]
        subgraph AI["AI Processing Engine"]
            DET["InspireFace\nFace Detect\n(Megatron)"]
            EMB["512-D\nEmbedding\nExtraction"]
            MAT["Cosine\nSimilarity\nMatching"]
            DET --> EMB --> MAT
        end
        EMP --> AI
        ATT --> AI
    end

    subgraph Data["Data Layer — SQLite Database"]
        DB_EMP[("Employees\n(Embedding as BLOB)")]
        DB_ATT[("Attendance\n(Logs + Confidence)")]
        DB_PAY[("Payroll\n(Salary + Analytics)")]
    end

    Mobile -->|"HTTPS (ngrok)"| Application
    Admin -->|"HTTP"| Application
    Application --> Data
```

---

## Figure 2.1: System Workflow — End-to-End Pipeline

```mermaid
sequenceDiagram
    participant E as 👤 Employee
    participant C as 📱 Camera
    participant B as ⚙️ FastAPI Backend
    participant AI as 🧠 AI Engine
    participant DB as 🗄️ SQLite Database

    E->>C: 1. Face Camera
    C->>B: 2. Send Base64 Image (HTTPS)
    B->>B: 3. Decode Base64 → NumPy Array
    B->>AI: 4. Process Image
    AI->>AI: 5. InspireFace: Detect Face
    AI->>AI: 6. Extract 512-D Embedding
    AI->>AI: 7. L2 Normalize Embedding
    AI->>DB: 8. Load All Stored Embeddings
    DB-->>AI: 9. Return Employee Embeddings
    AI->>AI: 10. Compute Cosine Similarity
    AI->>AI: 11. Find Best Match
    AI->>AI: 12. Apply Threshold (≥ 0.6)
    AI->>DB: 13. Save Attendance Log
    AI-->>B: 14. Return Match Result
    B-->>E: 15. Response (Name, Confidence, Status)
```

---

## Figure 2.2: Use Case Diagram — HRMS

```mermaid
graph LR
    subgraph Actors
        EMP["👤 Employee\n(Mobile User)"]
        ADM["🔑 Admin / HR\n(Desktop User)"]
    end

    subgraph System["AI-Powered HRMS System"]
        UC1["UC-01:\nSelf-Registration\nwith Face Capture"]
        UC2["UC-02:\nDaily Attendance\nCheck-In"]
        UC3["UC-03:\nView Check-In\nStatus"]
        UC4["UC-04:\nJWT Login"]
        UC5["UC-05:\nManage Employees"]
        UC6["UC-06:\nView Attendance\nHistory"]
        UC7["UC-07:\nGenerate Monthly\nPayroll"]
        UC8["UC-08:\nView Analytics\nDashboard"]
        UC9["UC-09:\nManage\nDepartments"]
    end

    EMP --- UC1
    EMP --- UC2
    EMP --- UC3
    ADM --- UC4
    ADM --- UC5
    ADM --- UC6
    ADM --- UC7
    ADM --- UC8
    ADM --- UC9
```

---

## Figure 2.3: Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    DEPARTMENT ||--o{ EMPLOYEE : "has"
    DEPARTMENT ||--o{ ATTENDANCE : "tracks"
    EMPLOYEE ||--o{ ATTENDANCE : "marks"
    EMPLOYEE ||--o{ PAYROLL : "receives"

    DEPARTMENT {
        int id PK
        string name UK
        string description
        datetime created_at
    }

    EMPLOYEE {
        int id PK
        string name
        string email UK
        string employee_id UK
        int department_id FK
        blob face_embedding "512-D × float32 = 2048 bytes"
        datetime created_at
    }

    ATTENDANCE {
        int id PK
        int employee_id FK
        int department_id FK
        date date
        datetime check_in_time
        datetime check_out_time
        float confidence_score "AI recognition confidence"
    }

    PAYROLL {
        int id PK
        int employee_id FK
        int month
        int year
        int total_days
        int present_days
        float per_day_salary
        float total_salary
        datetime created_at
    }

    ADMIN {
        int id PK
        string username UK
        string email UK
        string hashed_password "bcrypt"
        datetime created_at
    }
```

---

## Figure 2.5: Component Architecture Diagram

```mermaid
graph TB
    subgraph Frontend["Frontend Layer"]
        REACT["React.js 18 + Vite"]
        DASH["Dashboard Overview"]
        EMP_UI["Employee Management"]
        ATT_UI["Attendance Monitor"]
        PAY_UI["Payroll Module"]
        ANA_UI["Analytics (Recharts)"]
        REACT --> DASH & EMP_UI & ATT_UI & PAY_UI & ANA_UI
    end

    subgraph Mobile["Mobile Layer"]
        REG_HTML["register.html"]
        ATT_HTML["attendance.html"]
        CAM_JS["camera.js"]
        REG_HTML --> CAM_JS
        ATT_HTML --> CAM_JS
    end

    subgraph Backend["Backend Layer — FastAPI"]
        MAIN["main.py\n(FastAPI App)"]
        AUTH_API["api/auth.py\n(JWT Auth)"]
        EMP_API["api/employees.py\n(CRUD + Face Reg)"]
        ATT_API["api/attendance.py\n(Check-in)"]
        PAY_API["api/payroll.py\n(Salary Calc)"]
        ANA_API["api/analytics.py\n(Stats & Trends)"]
        MAIN --> AUTH_API & EMP_API & ATT_API & PAY_API & ANA_API
    end

    subgraph AIEngine["AI Engine"]
        ISF["inspireface_engine.py\n(InspireFace + Fallback)"]
        EMB_MGR["embedding_manager.py\n(Serialize/Deserialize)"]
        ISF --> EMB_MGR
    end

    subgraph Database["Data Layer"]
        DB[("SQLite\n(SQLAlchemy ORM)")]
        MODELS["models.py"]
        DBCONF["database.py"]
        MODELS --> DB
        DBCONF --> DB
    end

    Frontend -->|"HTTP API"| Backend
    Mobile -->|"HTTPS (ngrok)"| Backend
    EMP_API & ATT_API --> AIEngine
    AIEngine --> Database
    Backend --> Database
```

---

## Figure 3.1: Convolutional Neural Network — Layer Structure

```mermaid
graph LR
    A["🖼️ Input Image\n112 × 112 × 3\n(RGB)"] --> B["Conv Layer 1\nFilters: 64\n56 × 56"]
    B --> C["Conv Layer 2\nFilters: 128\n28 × 28"]
    C --> D["Conv Layer 3\nFilters: 256\n14 × 14"]
    D --> E["Conv Layer 4\nFilters: 512\n7 × 7"]
    E --> F["Global Avg\nPooling\n1 × 1 × 512"]
    F --> G["FC Layer\nDense"]
    G --> H["📐 Output\n512-D Vector"]

    style A fill:#4CAF50,color:#fff
    style H fill:#2196F3,color:#fff
```

---

## Figure 3.2: ResNet-50 — Residual Block (Bottleneck)

```mermaid
graph TD
    INPUT["Input x"] --> CONV1["1×1 Conv, 64\n(Reduce Dimensions)"]
    CONV1 --> BN1["Batch Normalization"]
    BN1 --> RELU1["ReLU Activation"]
    RELU1 --> CONV2["3×3 Conv, 64\n(Spatial Features)"]
    CONV2 --> BN2["Batch Normalization"]
    BN2 --> RELU2["ReLU Activation"]
    RELU2 --> CONV3["1×1 Conv, 256\n(Expand Dimensions)"]
    CONV3 --> BN3["Batch Normalization"]
    BN3 --> ADD["⊕ Addition"]
    INPUT -->|"Skip Connection\n(Identity Shortcut)"| ADD
    ADD --> RELU3["ReLU Activation"]
    RELU3 --> OUTPUT["Output: F(x) + x"]

    style INPUT fill:#FF9800,color:#fff
    style ADD fill:#E91E63,color:#fff
    style OUTPUT fill:#4CAF50,color:#fff
```

---

## Figure 3.3: ArcFace — Angular Margin on Hypersphere

```mermaid
graph TD
    subgraph Training["ArcFace Training Mechanism"]
        A["Aligned Face Image\n112 × 112 × 3"] --> B["ResNet-50\nBackbone"]
        B --> C["Raw Feature Vector x_i"]
        C --> D["L2 Normalize\nFeature x_i"]
        
        W["FC Layer Weights W_j"] --> E["L2 Normalize\nWeights W_j"]
        
        D --> F["Dot Product\nW_j^T × x_i = cos θ"]
        E --> F
        
        F -->|"Target Class y_i"| G["Add Angular Margin m\ncos(θ + m)"]
        F -->|"Other Classes j ≠ y_i"| H["No Margin\ncos θ_j"]
        
        G --> I["Multiply by Scale s"]
        H --> J["Multiply by Scale s"]
        
        I --> K["Softmax Loss"]
        J --> K
    end

    subgraph Inference["Inference Phase"]
        C2["Raw Feature Vector"] --> N["L2 Normalize"]
        N --> O["512-D Face Embedding\n(Unit Vector on Hypersphere)"]
    end

    style A fill:#4CAF50,color:#fff
    style G fill:#E91E63,color:#fff
    style O fill:#2196F3,color:#fff
```

---

## Figure 3.4: ArcFace + ResNet-50 — Complete Architecture

```mermaid
graph TD
    A["Aligned Face Image\n112 × 112 × 3"] -->|Input| B["ResNet-50 Backbone"]

    subgraph Extraction["Feature Extraction (ResNet-50)"]
        B -->|"Conv 7×7, MaxPool"| C["Conv1 Layer"]
        C -->|"Residual Blocks ×3"| D["Conv2_x\n56 × 56"]
        D -->|"Residual Blocks ×4"| E["Conv3_x\n28 × 28"]
        E -->|"Residual Blocks ×6"| F["Conv4_x\n14 × 14"]
        F -->|"Residual Blocks ×3"| G["Conv5_x\n7 × 7"]
        G -->|"Reduce Spatial"| H["Global Average Pooling"]
        H -->|"Flatten"| I["Fully Connected Layer"]
        I -->|"Output"| J(("Raw Feature\nVector x_i"))
    end

    subgraph Margin["ArcFace Mechanism (Angular Margin)"]
        J -.-> K["Feature L2\nNormalization"]
        L["FC Weights W_j"] -.-> M["Weight L2\nNormalization"]
        K --> N{"Dot Product"}
        M --> N
        N -->|"cos(θ)"| O["Calculate Angle"]
        O -->|"Target Class y_i"| P["Add Margin m"]
        P -->|"cos(θ + m)"| Q["Multiply by Scale s"]
        O -->|"Other Classes j"| R["Multiply by Scale s"]
        Q --> S(("Softmax Loss"))
        R --> S
    end

    J ==>|"Inference Phase"| T(("512-D L2 Normalized\nFace Embedding"))

    style A fill:#4CAF50,color:#fff
    style T fill:#2196F3,color:#fff
    style S fill:#E91E63,color:#fff
```

---

## Figure 3.5: Face Detection → Alignment → Embedding Pipeline

```mermaid
graph LR
    A["📷 Camera\nFrame"] --> B["Base64\nDecode"]
    B --> C["NumPy Array\n(BGR Image)"]
    C --> D["InspireFace\ndetect_faces()"]
    D --> E["Face Object\n(BBox + Landmarks)"]
    E --> F["InspireFace\nface_feature_extract()"]
    F --> G["Raw 512-D\nVector"]
    G --> H["L2 Normalize\nv̂ = v / ||v||₂"]
    H --> I["✅ Normalized\n512-D Embedding\n(float32)"]

    style A fill:#FF9800,color:#fff
    style I fill:#4CAF50,color:#fff
```

---

## Figure 3.6: Cosine Similarity — Geometric Interpretation

```mermaid
graph TD
    subgraph Same["Same Person — Small Angle"]
        O1(("Origin")) --> VA1["Vector A\n(Live Embedding)"]
        O1 --> VB1["Vector B\n(Stored Embedding)"]
    end
    R1["cos(θ) ≈ 0.9\n✅ MATCH"]

    subgraph Diff["Different Person — Large Angle"]
        O2(("Origin")) --> VA2["Vector A\n(Live Embedding)"]
        O2 --> VB2["Vector B\n(Stored Embedding)"]
    end
    R2["cos(θ) ≈ 0.3\n❌ REJECTED"]

    Same --> R1
    Diff --> R2

    style R1 fill:#4CAF50,color:#fff
    style R2 fill:#f44336,color:#fff
```

---

## Figure 4.1: Data Flow Diagram — Level 0 (Context)

```mermaid
graph LR
    EMP["👤 Employee\n(Face Image + Details)"] -->|"Input"| SYS["🔷 AI-Powered\nHRMS System"]
    SYS -->|"Output"| ADM["🔑 Admin / HR\n(Reports, Analytics,\nPayroll)"]
    SYS <-->|"Read/Write"| DB[("🗄️ SQLite\nDatabase")]

    style SYS fill:#3F72AF,color:#fff
    style DB fill:#112D4E,color:#fff
```

---

## Figure 4.2: Data Flow Diagram — Level 1

```mermaid
graph TD
    EMP["👤 Employee"] -->|"Face Image"| P1["P1: Face\nDetection"]
    P1 -->|"Detected Face"| P2["P2: Embedding\nExtraction"]
    P2 -->|"512-D Vector"| P3["P3: Registration\n(Store Embedding)"]
    P2 -->|"512-D Vector"| P4["P4: Recognition\n(Compare Embeddings)"]

    P3 --> D1[("D1: Employee\nDatabase")]
    D1 -->|"Stored Embeddings"| P4
    P4 --> D2[("D2: Attendance\nDatabase")]

    D2 --> P5["P5: Analytics\nEngine"]
    D2 --> P6["P6: Payroll\nCalculation"]

    P5 -->|"Reports & Charts"| ADM["🔑 Admin"]
    P6 -->|"Payslips"| ADM

    style P1 fill:#FF9800,color:#fff
    style P2 fill:#E91E63,color:#fff
    style P4 fill:#9C27B0,color:#fff
```

---

## Figure 4.3: Threshold vs. FAR/FRR Trade-off Curve

```mermaid
xychart-beta
    title "Threshold vs. FAR/FRR Trade-off"
    x-axis "Threshold" [0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
    y-axis "Error Rate (%)" 0 --> 25
    line "FAR (False Accept)" [10, 5, 2, 0.5, 0.1, 0.01]
    line "FRR (False Reject)" [0.1, 0.5, 2, 5, 10, 20]
```

---

## Figure 4.4: Attendance Trend Analytics Dashboard

```mermaid
xychart-beta
    title "Monthly Attendance Rate (%)"
    x-axis ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    y-axis "Attendance %" 60 --> 100
    bar [85, 88, 82, 90, 87, 91, 89, 86, 92, 88, 84, 90]
```

---

## Employee Registration Flow

```mermaid
flowchart TD
    START(["🟢 Start"]) --> A["Employee opens\nRegistration Page"]
    A --> B["Fills details:\nName, Email, ID, Dept"]
    B --> C["Clicks 'Capture Face'"]
    C --> D["Camera captures\nface image"]
    D --> E["Image → Base64\n→ Send to API"]
    E --> F{"Face\nDetected?"}
    F -->|"No"| G["❌ Error:\nNo Face Found"]
    G --> C
    F -->|"Yes"| H["Extract 512-D\nEmbedding"]
    H --> I["L2 Normalize\nEmbedding"]
    I --> J["Serialize to bytes\n(2,048 bytes)"]
    J --> K["Store in DB as\nBLOB"]
    K --> L["Discard original\nimage 🔒"]
    L --> END(["✅ Registration\nComplete"])

    style START fill:#4CAF50,color:#fff
    style END fill:#2196F3,color:#fff
    style G fill:#f44336,color:#fff
    style L fill:#FF9800,color:#fff
```

---

## Attendance Check-In Flow

```mermaid
flowchart TD
    START(["🟢 Start"]) --> A["Employee opens\nAttendance Page"]
    A --> B["Clicks 'Check In'"]
    B --> C["Camera captures\nface frame"]
    C --> D["Image → Base64\n→ Send to API"]
    D --> E{"Face\nDetected?"}
    E -->|"No"| F["❌ No Face\nDetected"]
    E -->|"Yes"| G["Extract live\n512-D Embedding"]
    G --> H["Load all stored\nembeddings from DB"]
    H --> I["Compute Cosine\nSimilarity with each"]
    I --> J["Find highest\nsimilarity score"]
    J --> K{"Score ≥\nThreshold 0.6?"}
    K -->|"No"| L["❌ Recognition\nFailed"]
    K -->|"Yes"| M{"Already checked\nin today?"}
    M -->|"Yes"| N["⚠️ Duplicate\nCheck-in"]
    M -->|"No"| O["✅ Mark Attendance\n(Save with confidence)"]
    O --> P["Return: Employee Name\n+ Confidence Score"]
    P --> END(["✅ Done"])

    style START fill:#4CAF50,color:#fff
    style END fill:#2196F3,color:#fff
    style F fill:#f44336,color:#fff
    style L fill:#f44336,color:#fff
    style O fill:#4CAF50,color:#fff
```

---

## AI Processing Pipeline (Detailed)

```mermaid
graph TD
    A["📷 Raw Image\n(Base64 encoded)"] --> B["base64.b64decode()"]
    B --> C["np.frombuffer()\n→ NumPy array"]
    C --> D["cv2.imdecode()\n→ BGR image"]

    D --> E{"InspireFace\nAvailable?"}
    E -->|"Yes"| F["session.face_detection()\n→ Face objects"]
    E -->|"No"| G["Haar Cascade\ndetectMultiScale()\n→ Bounding boxes"]

    F --> H["session.face_feature_extract()\n→ Raw 512-D vector"]
    G --> I["Resize 64×64 → Gray\n→ Sample every 8th pixel\n→ 512-D vector"]

    H --> J["L2 Normalize\nv̂ = v / ||v||₂"]
    I --> J

    J --> K["512-D Embedding\n(float32, unit norm)"]

    K --> L{"Mode?"}
    L -->|"Registration"| M["embedding.tobytes()\n→ Store as BLOB"]
    L -->|"Check-In"| N["np.dot(live, stored)\n→ Cosine similarity"]
    N --> O{"sim ≥ 0.6?"}
    O -->|"Yes ✅"| P["Identity Confirmed\nMark Attendance"]
    O -->|"No ❌"| Q["Identity Rejected"]

    style A fill:#FF9800,color:#fff
    style K fill:#9C27B0,color:#fff
    style P fill:#4CAF50,color:#fff
    style Q fill:#f44336,color:#fff
```

---

## System Deployment Architecture

```mermaid
graph TB
    subgraph Internet["☁️ Internet"]
        NGROK["ngrok Tunnel\n(HTTPS)"]
    end

    subgraph Server["🖥️ Server Machine"]
        subgraph Backend["Python Backend"]
            FASTAPI["FastAPI\n:8000"]
            INSPIRE["InspireFace\nMegatron Model"]
            SQLITE[("SQLite DB\nhrms.db")]
            FASTAPI --> INSPIRE
            FASTAPI --> SQLITE
        end

        subgraph Frontend["React Frontend"]
            VITE["Vite Dev Server\n:3000"]
        end

        VITE -->|"API calls"| FASTAPI
    end

    subgraph Devices["📱 Employee Devices"]
        PHONE1["📱 Phone 1"]
        PHONE2["📱 Phone 2"]
        PHONE3["📱 Phone 3"]
    end

    subgraph AdminPC["💻 Admin PC"]
        BROWSER["🌐 Browser"]
    end

    PHONE1 & PHONE2 & PHONE3 -->|"HTTPS"| NGROK
    NGROK -->|"HTTP"| FASTAPI
    BROWSER -->|"HTTP"| VITE

    style NGROK fill:#1976D2,color:#fff
    style INSPIRE fill:#E91E63,color:#fff
    style SQLITE fill:#112D4E,color:#fff
```
