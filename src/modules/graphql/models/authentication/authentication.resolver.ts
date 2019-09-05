// // import { ApiError }          from '@entities/ApiError';
// import { SimpleResponse }    from '@entities/SimpleResponse';
import { AuthenticatedUserInterface } from '@interfaces';

import * as ports                     from '@ports';

export default {
    Mutation: {
        login: async (parentValue: any, args: any, context: any): Promise<AuthenticatedUserInterface> => {
            return await ports.login(args.username, args.password);
        }
    },
    // Unions: {
    //     AuthenticatedUserUnion: {
    //         __resolveType(parentValues: AuthenticatedUser | ApiError) {
    //             if (parentValues instanceof AuthenticatedUser) {
    //                 return 'AuthenticatedUser';
    //             } else if (parentValues instanceof ApiError) {
    //                 return 'ApiError';
    //             } else {
    //                 return null;
    //             }
    //         }
    //     }
    // }
};