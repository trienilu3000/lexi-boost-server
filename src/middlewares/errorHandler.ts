import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../utils/errorHandler';

const errorHandler = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
};

export default errorHandler;