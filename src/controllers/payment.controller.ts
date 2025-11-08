import { Request, Response } from 'express';
import { stripe, PLANS, PlanId } from '../config/stripe.config';
import Stripe from 'stripe';


export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const { planId, email } = req.body;

        if (!planId || !['starter', 'pro'].includes(planId)) {
            res.status(400).json({
                success: false,
                error: 'Invalid plan ID. Must be "starter" or "pro"',
            });
            return;
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            res.status(400).json({
                success: false,
                error: 'Valid email address is required'
            });
            return;
        }

        const plan = PLANS[planId as PlanId];

        console.log(`\nCreating checkout session for ${email} - ${plan.name}`);

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: plan.priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.CLIENT_URL || 'http://localhost:3001'}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3001'}/cancel`,
            customer_email: email,
            metadata: {
                planId: planId,
                planName: plan.name,
            },
            allow_promotion_codes: true,
            billing_address_collection: 'auto',
        });

        console.log(`Checkout session created: ${session.id}`);
        console.log(`   Session URL: ${session.url}\n`);

        res.status(200).json({
            success: true,
            sessionId: session.id,
            url: session.url,
            plan: {
                id: planId,
                name: plan.name,
                price: plan.price / 100,
            }
        });
    } catch (error: any) {
        console.error('Error creating checkout session:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to create checkout session',
            details: error.message
        });
    }
}


export const handleWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
        console.error('No Stripe signature found in headers');
        res.status(400).send('No signature');
        return;
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error(`Webhook signature verification failed:`, err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                
                console.log('\n' + '='.repeat(80));
                console.log('✅ CHECKOUT SESSION COMPLETED');
                console.log('='.repeat(80));
                console.log(`Customer Email: ${session.customer_email}`);
                console.log(`Plan: ${session.metadata?.planName || session.metadata?.planId}`);
                console.log(`Subscription ID: ${session.subscription}`);
                console.log(`Payment Status: ${session.payment_status}`);
                console.log(`Session ID: ${session.id}`);
                console.log(`User ${session.customer_email} has paid for the ${session.metadata?.planName || session.metadata?.planId} Plan. Provisioning account.`);
                console.log('='.repeat(80) + '\n');

                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice;
                
                console.log('\n' + '='.repeat(80));
                console.log('💰 INVOICE PAYMENT SUCCEEDED');
                console.log('='.repeat(80));
                console.log(`Customer: ${invoice.customer}`);
                console.log(`Amount Paid: $${(invoice.amount_paid / 100).toFixed(2)}`);
                console.log(`Invoice ID: ${invoice.id}`);
                console.log(`Subscription ID: ${invoice.subscription}`);
                console.log(`Period: ${new Date(invoice.period_start * 1000).toLocaleDateString()} - ${new Date(invoice.period_end * 1000).toLocaleDateString()}`);
                console.log('\n✅ Payment processed successfully. Subscription is active.');
                console.log('='.repeat(80) + '\n');

                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}\n`);
        }

        res.json({ 
            received: true, 
            eventType: event.type,
            eventId: event.id 
        });

    } catch (error: any) {
        console.error('Error processing webhook:', error.message);
        res.status(500).json({ 
            error: 'Webhook processing failed',
            details: error.message 
        });
    }
};