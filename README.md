# Crowdfunding Platform

A full-stack crowdfunding platform that connects startups with investors. Built with Spring Boot backend and React frontend, featuring secure authentication, campaign management, and payment integration.

---

## Features

### User Management

- **Role-based Authentication**: Support for Investors and Startups with JWT tokens
- **Secure Registration & Login**: Password hashing and session management
- **User Types**: Separate dashboards and permissions for different user roles

### Campaign Management

- **Create Campaigns**: Startups can create and manage crowdfunding campaigns
- **Campaign Approval**: Admin oversight for campaign publishing
- **Status Tracking**: Campaigns can be PENDING, ACTIVE, or COMPLETED
- **Category Organization**: Organize campaigns by technology, health, education, etc.

### Investment & Contributions

- **Multi-currency Support**: INR, USD, and EUR
- **Secure Payments**: Integrated with Razorpay payment gateway
- **Contribution Tracking**: Monitor funding progress in real-time

### Subscription System

- **Flexible Plans**: 3, 6, and 12-month subscription options
- **Role-specific Pricing**: Different pricing for Investors and Startups
- **Payment Integration**: Seamless subscription management

---

## Tech Stack

### Backend

- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: MySQL 8
- **Security**: Spring Security with JWT
- **Payments**: Razorpay Java SDK
- **ORM**: JPA/Hibernate

### Frontend

- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: CSS Modules

---

## Prerequisites

- Java 17 or higher
- Node.js 18+ and npm
- MySQL 8.0+
- Maven 3.6+

---

## Installation & Setup

### Backend Setup

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd crowdfunding-platform