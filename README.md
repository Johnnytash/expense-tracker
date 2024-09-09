# ExpenSync: Expense Tracker 

https://expensync.netlify.app

ExpenSync is a full-stack web application designed to help users track their income and expenses, promoting better financial management and addressing SDG 1: No Poverty. By providing clear visibility into personal finances, ExpenSync empowers users to make informed financial decisions.

## Tech Stack

### Frontend
- React.js
- Material-UI for component styling
- React Router for navigation
- Formik and Yup for form handling and validation
- Recharts for data visualization

### Backend
- Node.js
- Express.js
- MySQL database
- Sequelize ORM

### Authentication
- JSON Web Tokens (JWT) for session management
- Bcrypt for password hashing

## Features

- User registration and authentication
- Add, edit, and delete income and expense transactions
- Categorize transactions with tags
- Visualize financial data with charts
- Responsive design for mobile and desktop use

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- MySQL

## Setup and Installation

1. Clone the repository:
   ```
   [git clone https://github.com/your-username/expense-tracker.git](https://github.com/Johnnytash/expense-tracker.git)
   cd expense-tracker
   ```

2. Set up the backend:
   ```
   cd expensync-backend
   npm install
   ```

   Create a `.env` file in the backend directory with the following content:
   ```
   DB_NAME=your_database_name
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_HOST=localhost
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

3. Set up the frontend:
   ```
   cd ../expense-tracker
   npm install
   ```

4. Create the MySQL database:
   ```
   mysql -u your_username -p
   CREATE DATABASE your_database_name;
   ```

5. Run database migrations:
   ```
   cd ../expensync-backend
   npx sequelize-cli db:migrate
   ```

## Running the Application

1. Start the backend server:
   ```
   cd expensync-backend
   npm start
   ```
   The server will start on http://localhost:5000

2. In a new terminal, start the frontend development server:
   ```
   cd expense-tracker
   npm start
   ```
   The application will open in your default browser at http://localhost:3000

## Contributing

Contributions to ExpenSync are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
