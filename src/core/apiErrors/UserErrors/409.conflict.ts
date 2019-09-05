import { ApiError } from '@apiErrors';

const errorCode:number = 409;

class NewUserAlreadyExistsError extends ApiError {
    constructor(description?: string) {
        super(errorCode, 'Creating user conflict.', description);
    }
};

export {
    NewUserAlreadyExistsError
};