import { SchemaDirectiveVisitor } from 'apollo-server';
import { defaultFieldResolver }   from 'graphql';

import { decodeToken }            from '@services/token.services';

export default class IsAuthenticatedUserDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field: any) {
        const { resolve = defaultFieldResolver } = field;

        field.resolve = async (...args: any[]) => {
            let [{}, {}, context] = args;

            if (context && context.token && decodeToken(context.token)) {
                return await resolve.apply(this, args);
            } else {
                return 'Login required.';
            }

        }
    };
};