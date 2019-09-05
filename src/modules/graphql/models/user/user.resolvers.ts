import { 
    ApiErrorInterface,
    UserInterface
} from '@interfaces';
import * as ports from '@ports';

export default {
    Mutation: {
        createUser: async (parentValue: any, args: any, context: any): Promise<UserInterface | ApiErrorInterface> => {
            return await ports.createUser(args.data);
        }
    },
    Unions: {
        UserUnion: {
            __resolveType(parentValues: UserInterface | ApiErrorInterface) {
                if ('apiErrorCode' in parentValues) {
                    return 'ApiError';
                } else {
                    return 'User';
                }
            }
        }
    }
};