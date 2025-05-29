# 🎮 Turf Project Setup Guide

Hey there! Let's set up this project together! It's like building a cool toy - we'll do it step by step! 

## 🚀 What You Need First

Before we start, make sure you have these things on your computer:
- Node.js (like a special toolbox we need)
- npm (it comes with Node.js)
- Git (to get our project)

## 📦 Step 1: Get the Project

First, let's get our project! Open your computer's terminal (it's like a special window where we type commands) and type:

```bash
git clone [your-repository-url]
cd Turf
```

## 🏗️ Step 2: Set Up the Backend (Server)

The backend is like the brain of our project! Let's set it up:

1. Go to the server folder:
```bash
cd server
```

2. Install the tools we need:
```bash
npm install
```

3. Create a special file called `.env` in the server folder and add these things:
```
# Database URLs (for Supabase)
DATABASE_URL="your-supabase-pooler-url"
DIRECT_URL="your-supabase-direct-url"

# Authentication
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3000
NODE_ENV="development"

# Stripe Configuration
STRIPE_SECRET_KEY="your-stripe-secret-key"
```

4. Start the server:
```bash
npm run dev
```

## 🎨 Step 3: Set Up the Frontend (Client)

The frontend is what everyone sees! Let's make it work:

1. Open a new terminal window and go to the client folder:
```bash
cd client
```

2. Install the tools we need:
```bash
npm install
```

3. Create a `.env` file in the client folder and add:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Start the client:
```bash
npm start
```


