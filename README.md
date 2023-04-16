# REST API - Course Assignment
Description
This is an API project developed by Rickard Sandvik as part of an assament for school. The application allows users to perform CRUD operations on a Todo app.

# Application Installation and Usage Instructions
Clone the repository to your local machine using git clone https://github.com/TheRickStick/Rickard_Sandvik_API_CA_Aug22FT.git
Install the necessary dependencies using npm install
Create a .env file in the root directory of the project and add the required environment variables (see below)

Start the application using npm start


# Environment Variables
The following environment variables are required in the .env file:

HOST : The hostname for the application
ADMIN_USERNAME : The username for the admin user
ADMIN_PASSWORD : The password for the admin user
DATABASE_NAME : The name of the MySQL database
DIALECT : The dialect of the database system (in this case, MySQL)
PORT : The port number for the application to listen on
JWT_SECRET : The secret key used for JSON Web Token authentication
EMAIL : The email address to be used for sending email notifications
PASSWORD : The password for the email account


# Additional Libraries/Packages
-"jsend": "^1.1.0",
-"jsonwebtoken": "^9.0.0", and
-"devDependencies": 
    "jest": "^29.5.0",
    "supertest": "^6.3.3"


# NodeJS Version Used
This was deveolped using Node.js version v16.17.0


# POSTMAN Documentation link

https://documenter.getpostman.com/view/25739749/2s93XyUNi3