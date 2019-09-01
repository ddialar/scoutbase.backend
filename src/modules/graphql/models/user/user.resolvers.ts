import { AuthenticatedUserInterface } from '@interfaces';

import * as ports                     from '@ports';

export default {
    Mutation: {
        createUser: async (parentValue: any, args: any, context: any): Promise<AuthenticatedUserInterface> => {
            return await ports.createUser(args.data);
        }
    }
};