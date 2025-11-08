import { Request } from 'express';
import express from 'express';

export const rawBodyMiddleware = express.raw({ type: 'application/json' });

export interface RequestWithRawBody extends Request {
    rawBody?: Buffer;
}