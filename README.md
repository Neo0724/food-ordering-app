# 🍽️ React Native Canteen Food Ordering and Crediting System App

This project consists of:

- **Android Client App** (React Native)
- **Spring Boot Backend Server**
- **Node JS WebSocket Server**

---

## ✨ Features

- **User Authentication** (Sign in/up, managed by Firebase Authentication)
- **Profile Management** (View and update username and password).
- **View Avaiable Foods**
- **Cart Management** (Manage the foods that are added into the cart)
- **Order Placement & History**
- **Multiple Payment Methods**
  - Pay with account credit (top up via debit card)
  - Pay with earned points
- **Points & Credit System** (Earn points by placing orders, view balances, and pay with points or credit)
- **Transaction History** (View all top-ups and payments)
- **Real-time Order Notifications** (Receive instant notifications when your order is completed)

---

## 🛠️ Prerequisites

Make sure the following are installed on your system:

- Node.js & npm
- Java 17+
- Maven
- Android Studio / Emulator or a connected Android device

---

## 📱 Running the Android Application

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory and copy the contents from `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Fill in the required environment variables in the `.env` file according to your setup.

5. Configure Fireabse Authentication
   - Create an account in Firebase Console
   - Download the `google-services.json` from Firebase Console and place it inside the `client/android/app` folder

5. Run the app on your Android device/emulator:

   ```bash
   npm run android-run
   ```

---

## ☕ Running the Spring Boot Server

1. Navigate to the server directory:

   ```bash
   cd server/food
   ```

2. Run the server using Maven:

   ```bash
   mvn spring-boot:run
   ```

---

## 🔌 Running the WebSocket Server

1. Navigate to the WebSocket server directory:

   ```bash
   cd web-socket
   ```

2. Install dependencies using Bun:

   ```bash
   npm install
   ```

3. Start the WebSocket server:

   ```bash
   node ./server.js
   ```

---

## ✅ Project Structure

```
project-root/
├── client/         # React Native Android App
├── server/
│   └── food/       # Spring Boot Backend
└── web-socket/     # Bun-based WebSocket Server
```
