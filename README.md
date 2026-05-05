# \# Crowdfunding Platform

# 

# A full-stack crowdfunding platform that connects startups with investors. Built with Spring Boot backend and React frontend, featuring secure authentication, campaign management, and payment integration.

# 

# \##  Features

# 

# \### User Management

# \- \*\*Role-based Authentication\*\*: Support for Investors and Startups with JWT tokens

# \- \*\*Secure Registration \& Login\*\*: Password hashing and session management

# \- \*\*User Types\*\*: Separate dashboards and permissions for different user roles

# 

# \### Campaign Management

# \- \*\*Create Campaigns\*\*: Startups can create and manage crowdfunding campaigns

# \- \*\*Campaign Approval\*\*: Admin oversight for campaign publishing

# \- \*\*Status Tracking\*\*: Campaigns can be PENDING, ACTIVE, or COMPLETED

# \- \*\*Category Organization\*\*: Organize campaigns by technology, health, education, etc.

# 

# \### Investment \& Contributions

# \- \*\*Multi-currency Support\*\*: Support for INR, USD, and EUR

# \- \*\*Secure Payments\*\*: Integrated with Razorpay payment gateway

# \- \*\*Contribution Tracking\*\*: Monitor funding progress in real-time

# 

# \### Subscription System

# \- \*\*Flexible Plans\*\*: 3, 6, and 12-month subscription options

# \- \*\*Role-specific Pricing\*\*: Different pricing for Investors and Startups

# \- \*\*Payment Integration\*\*: Seamless subscription management

# 

# \##  Tech Stack

# 

# \### Backend

# \- \*\*Framework\*\*: Spring Boot 3.2.0

# \- \*\*Language\*\*: Java 17

# \- \*\*Database\*\*: MySQL 8

# \- \*\*Security\*\*: Spring Security with JWT

# \- \*\*Payments\*\*: Razorpay Java SDK

# \- \*\*ORM\*\*: JPA/Hibernate

# 

# \### Frontend

# \- \*\*Framework\*\*: React 19

# \- \*\*Build Tool\*\*: Vite

# \- \*\*Routing\*\*: React Router DOM

# \- \*\*HTTP Client\*\*: Axios

# \- \*\*Styling\*\*: CSS Modules

# 

# \##  Prerequisites

# 

# \- Java 17 or higher

# \- Node.js 18+ and npm

# \- MySQL 8.0+

# \- Maven 3.6+

# 

# \##  Installation \& Setup

# 

# \### Backend Setup

# 

# 1\. \*\*Clone the repository\*\*

# &#x20;  ```bash

# &#x20;  git clone <your-repo-url>

# &#x20;  cd crowdfunding-platform

# &#x20;  ```

# 

# 2\. \*\*Database Setup\*\*

# &#x20;  - Install MySQL and create a database named `crowdfunding\_db`

# &#x20;  - Update database credentials in `backend/crowdfunding-api/src/main/resources/application.properties`

# 

# 3\. \*\*Configure Razorpay\*\* (Optional for payments)

# &#x20;  - Get API keys from Razorpay dashboard

# &#x20;  - Update keys in `application.properties`

# 

# 4\. \*\*Build and Run\*\*

# &#x20;  ```bash

# &#x20;  cd backend/crowdfunding-api

# &#x20;  mvn clean install

# &#x20;  mvn spring-boot:run

# &#x20;  ```

# 

# The backend will start on `http://localhost:8080/api`

# 

# \### Frontend Setup

# 

# 1\. \*\*Navigate to frontend directory\*\*

# &#x20;  ```bash

# &#x20;  cd frontend/crowdfunding-app

# &#x20;  ```

# 

# 2\. \*\*Install dependencies\*\*

# &#x20;  ```bash

# &#x20;  npm install

# &#x20;  ```

# 

# 3\. \*\*Start development server\*\*

# &#x20;  ```bash

# &#x20;  npm run dev

# &#x20;  ```

# 

# The frontend will start on `http://localhost:5173`

# 

# \##  API Documentation

# 

# \### Authentication Endpoints

# \- `POST /api/auth/login` - User login

# \- `POST /api/auth/register` - User registration

# 

# \### Campaign Endpoints

# \- `GET /api/campaigns` - Get all campaigns (filtered by role)

# \- `GET /api/campaigns/{id}` - Get campaign details

# \- `POST /api/campaigns` - Create new campaign (STARTUP/ADMIN only)

# \- `PUT /api/campaigns/{id}` - Update campaign

# \- `DELETE /api/campaigns/{id}` - Delete campaign (ADMIN only)

# \- `PUT /api/campaigns/{id}/approve` - Approve campaign (ADMIN only)

# 

# \### Other Endpoints

# \- `/api/contributions` - Manage campaign contributions

# \- `/api/subscriptions` - Subscription management

# \- `/api/categories` - Campaign categories

# \- `/api/currencies` - Supported currencies

# 

# \##  Project Structure

# 

# ```

# crowdfunding-platform/

# ├── backend/

# │   └── crowdfunding-api/

# │       ├── src/main/java/com/crowdfunding/

# │       │   ├── controller/     # REST controllers

# │       │   ├── entity/         # JPA entities

# │       │   ├── repository/     # Data repositories

# │       │   ├── service/        # Business logic

# │       │   ├── security/       # Authentication \& security

# │       │   ├── config/         # Configuration classes

# │       │   └── dto/           # Data transfer objects

# │       └── src/main/resources/

# │           ├── application.properties

# │           └── data.sql       # Initial data

# └── frontend/

# &#x20;   └── crowdfunding-app/

# &#x20;       ├── src/

# &#x20;       │   ├── components/     # Reusable UI components

# &#x20;       │   ├── pages/         # Page components

# &#x20;       │   ├── services/      # API service functions

# &#x20;       │   └── assets/        # Static assets

# &#x20;       ├── public/           # Public static files

# &#x20;       └── package.json

# ```

# 

# \##  Security Features

# 

# \- JWT-based authentication

# \- Role-based access control (RBAC)

# \- Password hashing

# \- CORS configuration

# \- Input validation

# \- Secure payment processing

# 

# \##  Deployment

# 

# \### Backend Deployment

# ```bash

# cd backend/crowdfunding-api

# mvn clean package

# java -jar target/crowdfunding-api-0.0.1-SNAPSHOT.jar

# ```

# 

# \### Frontend Deployment

# ```bash

# cd frontend/crowdfunding-app

# npm run build

# \# Deploy the dist/ folder to your web server

# ```

# 

# \##  Contributing

# 

# 1\. Fork the repository

# 2\. Create a feature branch (`git checkout -b feature/AmazingFeature`)

# 3\. Commit your changes (`git commit -m 'Add some AmazingFeature'`)

# 4\. Push to the branch (`git push origin feature/AmazingFeature`)

# 5\. Open a Pull Request

# 

# \##  License

# 

# This project is licensed under the MIT License - see the LICENSE file for details.

# 

# \##  Contact

# 

# For questions or support, please open an issue in this repository.

# 

# \---

# 

# \*\*Note\*\*: This is a development project. For production use, ensure proper security configurations and testing.</content>

# <parameter name="filePath">e:\\project (2)\\project\\project\\crowdfunding-platform\\README.md

