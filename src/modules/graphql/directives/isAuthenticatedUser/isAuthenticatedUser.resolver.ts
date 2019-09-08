import { SchemaDirectiveVisitor } from 'apollo-server';
import { defaultFieldResolver } from 'graphql';

import { decodeToken } from '@services/token.services';

export default class IsAuthenticatedUserDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field: any) {
        const { resolve = defaultFieldResolver } = field;

        field.resolve = async (...args: any[]) => {
            let [{ }, { }, context] = args;
            let result: string = '';

            try {
                if (context && context.token && decodeToken(context.token)) {
                    result = await resolve.apply(this, args);
                } else {
                    result = 'Login required.';
                }
            } catch (error) {
                result = error.message;
            } finally {
                return result;
            }
        }
    };
};