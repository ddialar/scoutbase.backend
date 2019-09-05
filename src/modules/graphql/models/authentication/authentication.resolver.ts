import { 
    ApiErrorInterface,
    AuthenticatedUserInterface
} from '@interfaces';

import * as ports from '@ports';

export default {
    Mutation: {
        login: async (parentValue: any, args: any, context: any): Promise<AuthenticatedUserInterface | ApiErrorInterface> => {
            return await ports.login(args.username, args.password);
        }
    },
    Unions: {
        AuthenticatedUserUnion: {
            __resolveType(parentValues: AuthenticatedUserInterface | ApiErrorInterface) {
                if ('apiErrorCode' in parentValues) {
                    return 'ApiError';
                } else {
                    return 'AuthenticatedUser';
                }
            }
        }
    }
};