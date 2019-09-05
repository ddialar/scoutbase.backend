import { ApiErrorInterface } from '@interfaces';

export class ApiError implements ApiErrorInterface {
    constructor(
        public apiErrorCode: number, 
        public message: string, 
        public description: string = ''
    ) {}
}