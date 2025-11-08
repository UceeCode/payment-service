import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import paymentRoutes from './routes/payment.routes';
import { validateStripeConfig } from './config/stripe.config';

dotenv.config();

try {
    validateStripeConfig();
} catch (error: any) {
    console.error('\nSTRIPE CONFIGURATION ERROR');
}

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3001',
    credentials: true
}));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}


app.use(
    '/api/stripe-webhook',
    express.raw({ type: 'application/json' }),
    (req: Request, res: Response) => {
        require('./controllers/payment.controller').handleWebhook(req, res);
    }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req: Request, res: Response) => {
    res.json({
        success: true,
        service: 'FlowCraft Payment Service',
        message: 'Business Automation Workflows - Payment API',
        version: '1.0.0',
        endpoints: {
            health: 'GET /api/health',
            createCheckout: 'POST /api/create-checkout-session',
            webhook: 'POST /api/stripe-webhook'
        },
        documentation: 'See README.md for API documentation'
    });
});

app.use('/api', paymentRoutes);

app.use((_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        availableEndpoints: [
            'GET /api/health',
            'POST /api/create-checkout-session',
            'POST /api/stripe-webhook'
        ]
    });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('\nServer error:', err.message);
    console.error(err.stack);
    
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
});

app.listen(PORT, () => {
    console.log('FLOWCRAFT PAYMENT SERVICE STARTED');
    console.log(`Server running on port ${PORT}`);
    console.log(`Webhook endpoint: http://localhost:${PORT}/api/stripe-webhook`);
});

process.on('SIGTERM', () => {
    console.log('\n👋 SIGTERM signal received: closing HTTP server gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n👋 SIGINT signal received: closing HTTP server gracefully');
    process.exit(0);
});

export default app;