# 🏠 FixItNow - Home Services Marketplace Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Connecting customers with verified service providers for home maintenance and repair services**

FixItNow is a comprehensive full-stack platform that addresses the challenge of finding reliable, verified professionals for home services. Built with modern technologies, it provides a seamless experience for customers, service providers, and platform administrators.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [Contact](#-contact)

---

## ✨ Features

### 🔐 **Authentication & Authorization**
- JWT-based secure authentication with access & refresh tokens
- Role-based access control (Customer, Provider, Admin)
- HTTP-only cookie storage for enhanced security
- Automatic location capture using GPS + Google Maps

### 👥 **For Customers**
- 🔍 **Browse Services**: Location-based search with interactive Google Maps
- 📅 **Book Services**: Easy booking with date/time selection
- 💬 **Real-time Chat**: WebSocket-powered instant messaging with providers
- ⭐ **Review System**: Rate and review completed services
- 🚨 **Dispute Management**: Report issues with transparent resolution
- 📊 **Booking Dashboard**: Track all bookings with status updates

### 🛠️ **For Service Providers**
- 📝 **Profile Management**: Create comprehensive provider profiles
- ✅ **Verification System**: Document upload and admin approval workflow
- 🏷️ **Service Listing**: Add, edit, and manage service offerings
- 📬 **Booking Management**: Accept/reject/complete booking requests
- 🗺️ **Location Integration**: View customer locations on Google Maps
- 💬 **Customer Communication**: Real-time chat with customers
- ⭐ **Ratings Dashboard**: View customer feedback and ratings

### 👨‍💼 **For Administrators**
- 📊 **Analytics Dashboard**: Visual insights with Recharts (Pie, Bar, Line charts)
- ✓ **Provider Verification**: Approve/reject providers with document review
- 🎫 **Dispute Resolution**: Three-way group chat (Customer-Provider-Admin)
- 👥 **User Management**: View and manage all platform users
- 📈 **System Metrics**: Track bookings, revenue, top services, location trends
- 🔧 **Service Moderation**: Monitor and delete inappropriate services

### 💬 **Real-Time Features**
- WebSocket integration using STOMP protocol
- Instant message delivery
- Live booking status updates
- Unread message counters
- Auto-scroll chat interface

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Purpose |
|------------|---------|
| **React.js 18.x** | UI framework with hooks |
| **React Router v6** | Client-side routing |
| **Tailwind CSS** | Utility-first styling |
| **Vite** | Build tool & dev server |
| **Axios** | HTTP client with interceptors |
| **SockJS + STOMP** | WebSocket client |
| **Google Maps API** | Location services & mapping |
| **Recharts** | Data visualization |
| **Lucide React** | Icon library |

### **Backend**
| Technology | Purpose |
|------------|---------|
| **Spring Boot 3.5.6** | Application framework |
| **Spring Security** | Authentication & authorization |
| **Spring Data JPA** | Database ORM |
| **Spring WebSocket** | Real-time communication |
| **MySQL 8.0** | Relational database |
| **Java-JWT (Auth0)** | JWT token generation |
| **Lombok** | Boilerplate reduction |
| **Maven** | Dependency management |

### **APIs & Services**
- **Google Maps Geocoding API**: Address ↔ Coordinates conversion
- **Google Maps JavaScript API**: Interactive maps

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Pages     │  │  Components  │  │   Services   │       │
│  │  - Home     │  │  - NavBar    │  │  - API       │       │
│  │  - Login    │  │  - ChatWindow│  │  - WebSocket │       │
│  │  - Customer │  │  - Modals    │  │  - Auth      │       │
│  │  - Provider │  │  - Cards     │  │              │       │
│  │  - Admin    │  │              │  │              │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS / WebSocket
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Spring Boot)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Controllers  │  │  Security    │  │  WebSocket   │      │
│  │ - Auth       │  │  - JWT       │  │  - STOMP     │      │
│  │ - Booking    │  │  - CORS      │  │  - SockJS    │      │
│  │ - Service    │  │  - Roles     │  │              │      │
│  │ - Chat       │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│           │                  │                  │            │
│           ▼                  ▼                  ▼            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Repositories │  │   Services   │  │    Models    │      │
│  │ (Spring JPA) │  │   (Business  │  │  (Entities)  │      │
│  │              │  │     Logic)   │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │ JDBC
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      MySQL Database                          │
│  Tables: users, services, bookings, reviews, messages,      │
│          disputes, provider_profiles                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Java 21** or higher ([Download](https://www.oracle.com/java/technologies/downloads/))
- **Node.js 18.x** or higher ([Download](https://nodejs.org/))
- **MySQL 8.0** or higher ([Download](https://dev.mysql.com/downloads/))
- **Maven 3.8+** (usually bundled with IDEs)
- **Git** ([Download](https://git-scm.com/))

### System Requirements

- **OS**: Windows 10/11, macOS 10.15+, Linux (Ubuntu 20.04+)
- **RAM**: Minimum 8GB (16GB recommended)
- **Disk Space**: 2GB free space

---

## 📥 Installation

### 1️⃣ Clone the Repository

```bash
[git clone https://github.com/yourusername/fixitnow.git
cd fixitnow](https://github.com/ChandanChoudhury7727/FixitNow.git)
```

### 2️⃣ Database Setup

```sql
-- Create database
CREATE DATABASE fixitnow_db;
USE fixitnow_db;

-- Grant privileges (replace 'your_username' and 'your_password')
GRANT ALL PRIVILEGES ON fixitnow_db.* TO 'your_username'@'localhost' IDENTIFIED BY 'your_password';
FLUSH PRIVILEGES;
```

### 3️⃣ Backend Setup

```bash
cd fixitnow-backend

# Create application-local.properties
touch src/main/resources/application-local.properties
```

**Edit `application-local.properties`:**

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/fixitnow_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT Configuration
security.jwt.secret=your-256-bit-secret-key-change-this-in-production
security.jwt.access-token-expiration-ms=3600000
security.jwt.refresh-token-expiration-ms=604800000

# Google Maps API Key
security.maps.apiKey=YOUR_GOOGLE_MAPS_API_KEY
```

**Install dependencies and run:**

```bash
# Using Maven
mvn clean install
mvn spring-boot:run

# Or using Maven Wrapper
./mvnw clean install
./mvnw spring-boot:run
```

Backend will start on `http://localhost:8080`

### 4️⃣ Frontend Setup

```bash
cd fixitnow-frontend

# Install dependencies
npm install

# Create .env file
touch .env
```

**Edit `.env`:**

```env
VITE_API_BASE=http://localhost:8080
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

**Start development server:**

```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

---

## ⚙️ Configuration

### Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API
4. Create credentials → API Key
5. Restrict API key (recommended):
   - HTTP referrers: `http://localhost:5173/*`, `your-production-domain/*`
   - API restrictions: Select above three APIs only

### JWT Secret Generation

```bash
# Generate secure 256-bit key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Environment Variables

#### Backend (`application-local.properties`)
| Variable | Description | Example |
|----------|-------------|---------|
| `spring.datasource.url` | MySQL connection URL | `jdbc:mysql://localhost:3306/fixitnow_db` |
| `spring.datasource.username` | Database username | `root` |
| `spring.datasource.password` | Database password | `your_password` |
| `security.jwt.secret` | JWT signing key | `64-char-hex-string` |
| `security.maps.apiKey` | Google Maps API key | `AIzaSy...` |

#### Frontend (`.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE` | Backend API URL | `http://localhost:8080` |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps key | `AIzaSy...` |

---

## 📖 Usage

### Initial Setup

1. **Start Backend**: `mvn spring-boot:run` (port 8080)
2. **Start Frontend**: `npm run dev` (port 5173)
3. **Open Browser**: Navigate to `http://localhost:5173`

### First-Time User Flow

#### **As a Customer:**
1. Click **Register** → Select "Customer" role
2. Fill form and click **"Capture Location"** (allow browser location access)
3. Login with credentials
4. Browse services on the map
5. Click a service → **Book Now**
6. Fill booking details → Submit
7. Go to **My Bookings** to track status

#### **As a Provider:**
1. Register as "Provider"
2. Complete **Profile** (categories, description, location)
3. Upload verification documents (provide cloud storage link)
4. Wait for admin approval
5. Go to **Services** → Add new services
6. Manage bookings from **Bookings** tab
7. View reviews in **Reviews** tab

#### **As an Admin:**
1. Register a regular account
2. Use the **"Promote to Admin"** endpoint (see API docs)
3. Access **Admin Dashboard**
4. Verify providers in **Verification** tab
5. Monitor disputes in **Disputes** tab
6. View analytics in **Analytics** tab

### Testing the Platform

Use these test accounts (after creating via registration):

```
Customer: customer@test.com / password123
Provider: provider@test.com / password123  
Admin: admin@test.com / password123
```

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "CUSTOMER",
  "location": "Mumbai, Maharashtra",
  "latitude": 19.0760,
  "longitude": 72.8777
}

Response: 200 OK
{
  "message": "User registered",
  "email": "john@example.com",
  "role": "CUSTOMER"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "role": "CUSTOMER"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "role": "CUSTOMER",
  "location": "Mumbai, Maharashtra"
}
```

### Service Endpoints

#### Browse Services
```http
GET /api/services?category=Electrician&lat=19.0760&lng=72.8777&radiusKm=10

Response: 200 OK
[
  {
    "id": 1,
    "category": "Electrician",
    "subcategory": "Wiring",
    "description": "Expert electrical work",
    "price": 500.0,
    "location": "Andheri, Mumbai",
    "latitude": 19.1136,
    "longitude": 72.8697,
    "distanceKm": 4.2,
    "providerId": 5,
    "providerName": "Raj Sharma",
    "providerVerified": true
  }
]
```

#### Get Service Details
```http
GET /api/services/{serviceId}
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "id": 1,
  "category": "Electrician",
  "description": "Expert electrical work",
  "price": 500.0,
  "providerName": "Raj Sharma",
  "providerVerified": true,
  "avgRating": 4.5,
  "reviews": [...]
}
```

### Booking Endpoints

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "serviceId": 1,
  "bookingDate": "2024-02-15",
  "timeSlot": "10:00-11:00",
  "notes": "Need urgent repair",
  "customerLatitude": 19.0760,
  "customerLongitude": 72.8777
}

Response: 200 OK
{
  "success": true,
  "bookingId": 42
}
```

#### Get My Bookings (Customer)
```http
GET /api/customer/bookings
Authorization: Bearer {accessToken}

Response: 200 OK
[
  {
    "id": 42,
    "serviceId": 1,
    "customerId": 2,
    "providerId": 5,
    "bookingDate": "2024-02-15",
    "timeSlot": "10:00-11:00",
    "status": "PENDING",
    "notes": "Need urgent repair",
    "createdAt": "2024-02-10T10:30:00"
  }
]
```

### Provider Endpoints

#### Get Provider Bookings
```http
GET /api/provider/bookings
Authorization: Bearer {accessToken}

Response: 200 OK
[...]
```

#### Accept Booking
```http
POST /api/provider/bookings/{bookingId}/accept
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "message": "Status updated",
  "status": "CONFIRMED"
}
```

### Review Endpoints

#### Create Review
```http
POST /api/reviews
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "bookingId": 42,
  "rating": 5,
  "comment": "Excellent service!"
}

Response: 201 Created
{
  "message": "Review created successfully",
  "reviewId": 15
}
```

### Admin Endpoints

#### Get Analytics
```http
GET /api/admin/analytics
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "topServices": [...],
  "topProviders": [...],
  "locationTrends": [...],
  "statusDistribution": {...},
  "totalRevenue": 15000.00,
  "totalBookings": 150,
  "completedBookings": 120
}
```

#### Verify Provider
```http
POST /api/admin/providers/{providerId}/verify
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "action": "APPROVED",
  "notes": "All documents verified"
}

Response: 200 OK
{
  "message": "Provider verification updated",
  "providerId": 5,
  "status": "APPROVED"
}
```

### WebSocket (Chat)

#### Connect
```javascript
const socket = new SockJS('http://localhost:8080/ws');
const client = new Client({
  webSocketFactory: () => socket,
  onConnect: () => {
    client.subscribe('/queue/messages.{userId}', (message) => {
      console.log('Received:', JSON.parse(message.body));
    });
  }
});
client.activate();
```

#### Send Message
```javascript
client.publish({
  destination: '/app/chat.send',
  body: JSON.stringify({
    senderId: 2,
    receiverId: 5,
    content: 'Hello!'
  })
});
```

---

## 📁 Project Structure

```
fixitnow/
├── fixitnow-backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/fixitnow/
│   │   │   │   ├── config/           # Security, WebSocket, CORS
│   │   │   │   ├── controller/       # REST endpoints
│   │   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   ├── model/            # JPA Entities
│   │   │   │   ├── repository/       # Spring Data JPA
│   │   │   │   ├── service/          # Business logic
│   │   │   │   └── FixitnowApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── application-local.properties
│   │   └── test/                     # Unit tests
│   └── pom.xml
│
├── fixitnow-frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js     # Axios configuration
│   │   ├── assets/                   # Images, icons
│   │   ├── components/               # Reusable components
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── DisputeModal.jsx
│   │   │   ├── NavBar.jsx
│   │   │   └── ServiceChatView.jsx
│   │   ├── pages/
│   │   │   ├── customer/
│   │   │   │   ├── CustomerPanel.jsx
│   │   │   │   ├── CustomerBookings.jsx
│   │   │   │   ├── ServiceCard.jsx
│   │   │   │   └── ReviewModal.jsx
│   │   │   ├── provider/
│   │   │   │   └── ProviderPanel.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ServiceDetail.jsx
│   │   ├── utils/
│   │   │   ├── authHelper.js
│   │   │   └── googleLocation.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

## 📸 Screenshots

### Home Page
<img width="1739" height="872" alt="image" src="https://github.com/user-attachments/assets/9fdbd899-9e46-4654-a72d-7e09efff9a75" />


### Customer Dashboard
<img width="1522" height="956" alt="image" src="https://github.com/user-attachments/assets/c0ab7d50-9c44-42d8-9155-43c7c8c6a0cc" />


### Booking Flow
<img width="1291" height="905" alt="image" src="https://github.com/user-attachments/assets/fded1a57-e9b8-46a9-bf8b-249f15715083" />
<img width="734" height="886" alt="image" src="https://github.com/user-attachments/assets/6efa5a1d-1ca2-4b6b-bf0f-e72b375ca562" />



### Provider Panel
<img width="1579" height="1028" alt="image" src="https://github.com/user-attachments/assets/847b0905-3bfc-4452-b20a-4694e2d9cbd9" />
<img width="1567" height="935" alt="image" src="https://github.com/user-attachments/assets/716b131d-0919-4d8f-b31d-ce96a05f86fb" />
<img width="1283" height="687" alt="image" src="https://github.com/user-attachments/assets/13c95c77-eeab-4a1c-83f1-0fd7885dd7bc" />
<img width="1326" height="537" alt="image" src="https://github.com/user-attachments/assets/a1651f55-a8c6-4478-84f4-54abd09bf892" />


### Real-Time Chat
<img width="590" height="843" alt="image" src="https://github.com/user-attachments/assets/9d4dcd09-a664-4bd5-98ad-a8e6f8227b06" />
<img width="1058" height="936" alt="image" src="https://github.com/user-attachments/assets/61a0e05b-be89-4a18-9ed6-b72464fff365" />

### Admin Analytics
<img width="690" height="661" alt="image" src="https://github.com/user-attachments/assets/f0f95a78-8453-4088-977f-3076947d099d" />
<img width="543" height="610" alt="image" src="https://github.com/user-attachments/assets/eeb7dae7-3ebf-493f-b38c-1ae41478043f" />
<img width="509" height="502" alt="image" src="https://github.com/user-attachments/assets/3d89727a-d08e-46de-a9d0-1f3ca9e6239a" />


---



## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 1. Fork the Repository
```bash
git clone [https://github.com/yourusername/fixitnow.git](https://github.com/ChandanChoudhury7727/FixitNow.git)
cd fixitnow
```

### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

### 4. Test Your Changes
```bash
# Backend tests
cd fixitnow-backend
mvn test

# Frontend tests
cd fixitnow-frontend
npm run test
```

### 5. Commit & Push
```bash
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

### 6. Create Pull Request
- Go to GitHub repository
- Click "New Pull Request"
- Describe your changes clearly
- Link related issues

### Code Style Guidelines
- **Java**: Follow Google Java Style Guide
- **JavaScript/React**: Use ESLint + Prettier
- **Commits**: Follow Conventional Commits

---



## 👥 Team

### Development Team
- **Chandan Choudhury** - Frontend Developer
- **Akshay Khardekar** - Backend Developer

### Acknowledgments
- Google Maps API for location services
- Spring Boot community for excellent documentation
- React community for UI patterns
- All open-source contributors

---

## 📞 Contact

### Project Links
- **GitHub Repository**: [[https://github.com/yourusername/fixitnow](https://github.com/yourusername/fixitnow)](https://github.com/ChandanChoudhury7727/FixitNow.git)

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub!

---



<div align="center">

**Made with ❤️ by Team-4**

[⬆ Back to Top](#-fixitnow---home-services-marketplace-platform)

</div>

