import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is required in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
    typescript: true,
});

export const PLANS = {
    starter: {
        name: 'Starter Plan',
        description: 'Perfect for small teams getting started',
        price: 2900,
        priceId: process.env.STRIPE_STARTER_PRICE_ID || '',
        features: [
            'Up to 1,000 tasks per month',
            '5 active workflows',
            'Email support',
            'Community access',
            'Mobile app access'
        ]
    },
    pro: {
        name: 'Pro Plan',
        description: 'Maximum power for demanding organizations',
        price: 7900, 
        priceId: process.env.STRIPE_PRO_PRICE_ID || '',
        features: [
            'Up to 100,000 tasks per month',
            'Unlimited everything',
            'Premium integrations',
            '24/7 priority support',
            'Dedicated account manager',
            'Custom API limits',
            'Advanced security',
            'SLA guarantee',
            'White-label options'
        ]
    }
} as const;

export type PlanId = keyof typeof PLANS;

export const validateStripeConfig = () => {
    const requiredVars = [
        'STRIPE_SECRET_KEY',
        'STRIPE_STARTER_PRICE_ID',
        'STRIPE_PRO_PRICE_ID',
        'STRIPE_WEBHOOK_SECRET'
    ];

    const missing = requiredVars.filter(varName => !process.env[varName]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    
};