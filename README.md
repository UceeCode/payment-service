# FlowCraft Payment Service

A robust **Express.js + TypeScript** payment service integrated with **Stripe** for subscription management. Built for business automation workflows with Docker support.

---

## Features

- **Stripe Checkout Integration** - Secure payment processing  
- **Webhook Handling** - Real-time payment event processing  
- **Two-tier Subscription Plans** - Starter ($29/mo) and Pro ($79/mo)  
- **Docker Support** - Containerized deployment  
- **TypeScript** - Type-safe codebase  
- **Security First** - Helmet, CORS, webhook signature verification  
- **Health Monitoring** - Built-in health check endpoint  

---

## Prerequisites

- Node.js 18+  
- npm or yarn  
- Stripe account  
- Docker & Docker Compose (for containerized deployment)  

---

## Installation

### Local Development Setup

1. **Clone and Install Dependencies**  

    ```bash
    npm install
    ```

2. **Create a .env file in the root directory:**  

    ```bash
    NODE_ENV=development
    PORT=3000
    CLIENT_URL=http://localhost:3001

    # Stripe Keys
    STRIPE_SECRET_KEY=sk_test_your_secret_key
    STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
    STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

    # Price IDs (create these in Stripe Dashboard)
    STRIPE_STARTER_PRICE_ID=price_your_starter_price_id
    STRIPE_PRO_PRICE_ID=price_your_pro_price_id
    ```

## Quick Start

```bash
docker-compose up --build
```

## SUBMISSON VIDE0 LINKS

### Link 1 (Product set-up in stripe): https://www.loom.com/share/1a71939ca28747b3b7c9c7f66ba8b60e

### Link 2 (Technical Demo): https://www.loom.com/share/d6dc6ae950db4b94a4d29b9a79c22353
