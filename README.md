# UniBazaar

A university marketplace where students can buy and sell stuff to each other.

## What's in here?

- **Backend** (Spring Boot) - REST API, real-time chat via WebSocket, user auth, admin panel
- **Frontend** (React + Vite) - Listing browse, messaging, wishlist, ID verification

## Setup

### Backend
```bash
cd Backend
mvn clean install
mvn spring-boot:run
```
Runs on http://localhost:8080

### Frontend
```bash
cd Frontend
npm install
npm run dev
```
Runs on http://localhost:5173

## What you need

- Java 17+, Maven
- Node.js 16+
- MySQL / PostgreSQL
- Redis
- Cloudinary account (for image uploads)
- Gmail account (for emails)
- Google OAuth credentials

## Key Features

- User auth with JWT + Google OAuth
- List and sell items with images
- Real-time messaging between users
- Wishlist
- Admin dashboard for moderation
- Report system for bad stuff
- ID card verification

## Config

Add your credentials to `application.properties` (backend) and `.env` (frontend):
- Database URL
- JWT secret
- Cloudinary keys
- Gmail credentials
- Google API keys

## How to contribute

1. Fork it
2. Create a branch (`git checkout -b feature/something`)
3. Commit (`git commit -m 'add feature'`)
4. Push (`git push origin feature/something`)
5. Open a PR

## Issues?

Check GitHub issues or ask in a new one.

---

Made by Champ
