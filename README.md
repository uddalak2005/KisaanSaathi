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