import Router from 'express';
import {
    createCheckoutSession,
    handleWebhook,
} from '../controllers/payment.controller';
import { rawBodyMiddleware } from '../middleware/verify-webhook';


const router = Router();

router.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'FlowCraft Payment Service is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
    });
});

/**
 * @route   POST /api/create-checkout-session
 * @desc    Create a Stripe Checkout session for subscription
 * @access  Public
 */
router.post('/create-checkout-session', createCheckoutSession);

/**
 * @route   POST /api/stripe-webhook
 * @desc    Handle Stripe webhook events
 * @access  Stripe only (verified via signature)
 */
router.post('/stripe-webhook', rawBodyMiddleware, handleWebhook);

export default router;