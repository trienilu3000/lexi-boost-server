export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: ErrorResponse;
}

export interface ErrorResponse {
    errorCode: string;
    message: string;
}