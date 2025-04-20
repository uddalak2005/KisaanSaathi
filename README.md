# kisaan-saathi/kisaan-saathi/README.md

# Kisaan Saathi

Kisaan Saathi is a MERN stack application designed to provide microloans to small farmers without the need for collateral. Our unique selling proposition (USP) is to offer loans based on a yield score derived from the farmer's location and the crops they sow.

## Features

- **Microloans**: Access to loans without collateral.
- **Yield Score Assessment**: A trained model evaluates the yield score based on farmer data.
- **User Authentication**: Secure registration and login for users.
- **Loan Management**: Create, update, and retrieve loan information.
- **Transaction Processing**: Manage transactions related to loans.

## Project Structure

```
kisaan-saathi
├── backend
│   ├── config
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── services
│   ├── middleware
│   ├── app.js
│   └── server.js
├── frontend
│   ├── src
│   ├── package.json
│   └── README.md
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/kisaan-saathi.git
   ```

2. Navigate to the backend directory and install dependencies:
   ```
   cd kisaan-saathi/backend
   npm install
   ```

3. Navigate to the frontend directory and install dependencies:
   ```
   cd ../frontend
   npm install
   ```

## Usage

1. Start the backend server:
   ```
   cd kisaan-saathi/backend
   node server.js
   ```

2. Start the frontend application:
   ```
   cd kisaan-saathi/frontend
   npm start
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## API Routes
```
Authentication:
POST /api/auth/register         - Register new user
POST /api/auth/complete-profile - Complete user profile

Loans:
GET  /api/loans                 - Get all loans
POST /api/loans                 - Create new loan
GET  /api/loans/:id            - Get specific loan
PUT  /api/loans/:id            - Update loan status

Transactions:
POST /api/transactions         - Record new transaction
GET  /api/transactions/:loanId - Get loan transactionss

```

# Kisaan Saathi

...existing content...

## API Documentation

### Authentication Routes
Base URL: `/api/auth`

#### 1. Register New User
```http
POST /api/auth/register
Content-Type: application/json

Request Body:
{
    "phone": "+919876543210",    // Required, 12 digits with country code
    "password": "password123",    // Required, min 6 characters
    "firstName": "Ram",          // Required
    "lastName": "Singh"          // Required
}

Response (201):
{
    "token": "jwt_token_here",
    "user": {
        "userId": "KS000001",
        "phone": "+919876543210",
        "isProfileComplete": false
    }
    
}
```

#### 2. Login

```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
    "phone": "+919876543210",
    "password": "password123"
}

Response (200):
{
    "token": "jwt_token_here",
    "user": {
        "userId": "KS000001",
        "phone": "+919876543210",
        "isProfileComplete": true,
        "name": "Ram Singh"
    }
}

```

#### 3. Complete Profile

```

POST /api/auth/complete-profile
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "middleName": "Kumar",           // Optional
    "state": "Uttar Pradesh",        // Required
    "district": "Lucknow",           // Required
    "aadharNum": 123456789012        // Required, 12 digits
}

Response (200):
{
    "message": "Profile completed successfully",
    "user": {
        "userId": "KS000001",
        "name": "Ram Kumar Singh",
        "isProfileComplete": true
    }
}

```
### Loan Routes
Base URL : ```/api/loans```

#### 1. Create Loan Application

POST /api/loans
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "amount": 50000,           // Required
    "interestRate": 12,        // Required
    "duration": 12,            // Required, in months
    "borrowerId": "user_id"    // Required
}

Response (201):
{
    "_id": "loan_id",
    "amount": 50000,
    "interestRate": 12,
    "duration": 12,
    "status": "pending"
}

#### 2. Get All Loans

GET /api/loans
Authorization: Bearer <token>

Response (200):
[
    {
        "_id": "loan_id",
        "amount": 50000,
        "status": "pending",
        "createdAt": "2024-02-22T..."
    }
]

### Transaction Routes
Base URL : ```/api/transactions```

#### 1. Create Transaction

POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "loanId": "loan_id",
    "amount": 4500
}

Response (201):
{
    "_id": "transaction_id",
    "loanId": "loan_id",
    "amount": 4500,
    "status": "pending",
    "date": "2024-02-22T..."
}

### Yield Score
Base URL: ```/api/yield-score

#### 1. Get Yield Routes
POST /api/yield-score
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "location": {
        "state": "Uttar Pradesh",
        "district": "Lucknow"
    },
    "cropType": "Wheat"
}

Response (200):
{
    "score": 85,
    "location": {
        "state": "Uttar Pradesh",
        "district": "Lucknow"
    },
    "cropType": "Wheat"
}