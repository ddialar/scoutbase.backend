import { ApiError } from '@apiErrors';

const errorCode:number = 500;

class NewUserCreationError extends ApiError {
    constructor(description?: string) {
        super(errorCode, 'Creating user error.', description);
    }
};

export {
    NewUserCreationError
};