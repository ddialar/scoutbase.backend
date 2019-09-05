// import { ApiError } from '@apiErrors';
import { ApiError } from '@apiErrors';

const errorCode: number = 400;

export class AuthenticationBadRequestError extends ApiError {
    constructor(description?: string) {
        super(errorCode, 'Authentication bad request.', description);
    }
};