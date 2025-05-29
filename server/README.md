# Turf Booking API

A RESTful API backend to manage bookings for turfs, stadiums, and playgrounds, allowing users to browse, book, and manage their reservations.

## Features

- User authentication and authorization
- Turf management (CRUD operations)
- Booking management
- Availability checking
- Search functionality

## Tech Stack

- Node.js with Express.js
- PostgreSQL database with Prisma ORM
- JWT for authentication
- Joi for validation

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database (using Supabase)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd turf-booking-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.juexhqpruvbkzghabdvt.supabase.co:5432/postgres"
     JWT_SECRET="your-super-secret-jwt-key"
     JWT_EXPIRES_IN="7d"
     PORT=3000
     NODE_ENV="development"
     ```

4. Set up the database:
   ```
   npx prisma migrate dev --name init
   ```

5. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### User Management

- **Register User**
  - `POST /api/users/register`
  - Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123", "phone": "1234567890" }`

- **Login User**
  - `POST /api/users/login`
  - Body: `{ "email": "john@example.com", "password": "password123" }`

- **Get User Profile**
  - `GET /api/users/profile`
  - Headers: `Authorization: Bearer <token>`

- **Update User Profile**
  - `PUT /api/users/profile`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "name": "John Smith", "phone": "0987654321" }`

### Turf Management

- **Get All Turfs**
  - `GET /api/turfs`
  - Query Parameters: `location`, `type`, `available`

- **Search Turfs**
  - `GET /api/turfs/search`
  - Query Parameters: `keyword`, `location`, `type`

- **Get Turf by ID**
  - `GET /api/turfs/:id`

- **Add Turf (Admin)**
  - `POST /api/turfs`
  - Headers: `Authorization: Bearer <admin-token>`
  - Body: `{ "name": "Green Field", "location": "Downtown", "description": "Beautiful turf with...", "type": "TURF", "pricePerHour": 50, "imageUrl": "https://example.com/image.jpg" }`

- **Update Turf (Admin)**
  - `PUT /api/turfs/:id`
  - Headers: `Authorization: Bearer <admin-token>`
  - Body: `{ "name": "Green Field Pro", "pricePerHour": 60 }`

- **Delete Turf (Admin)**
  - `DELETE /api/turfs/:id`
  - Headers: `Authorization: Bearer <admin-token>`

### Booking Management

- **Check Availability**
  - `GET /api/bookings/availability/:turfId`
  - Query Parameters: `date` (format: "YYYY-MM-DD")

- **Create Booking**
  - `POST /api/bookings`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "turfId": 1, "date": "2023-06-15", "startTime": "2023-06-15T14:00:00Z", "endTime": "2023-06-15T16:00:00Z", "eventName": "Football Match" }`

- **Get User Bookings**
  - `GET /api/bookings`
  - Headers: `Authorization: Bearer <token>`

- **Cancel Booking**
  - `DELETE /api/bookings/:id`
  - Headers: `Authorization: Bearer <token>`

- **Get All Bookings (Admin)**
  - `GET /api/bookings/admin`
  - Headers: `Authorization: Bearer <admin-token>`
  - Query Parameters: `turfId`, `date`

## License

MIT 