import { ApiError } from '@apiErrors';

const errorCode:number = 400;

class CreateNewUserBadRequestError extends ApiError {
    constructor(description?: string) {
        super(errorCode, 'Create new user bad request.', description);
    }
};

export {
    CreateNewUserBadRequestError
};