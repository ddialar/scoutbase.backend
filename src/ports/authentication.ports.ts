import logger              from '@logger';

import { comparePassword } from '@services/password.services';
import { encodeToken }     from '@services/token.services';
import {
    ApiErrorInterface,
    UserInterface,
    AuthenticatedUserInterface
} from '@interfaces';
import { AuthenticationBadRequestError } from '@apiErrors';

import * as adapters from '@adapters';

const login = async (username: string, password: string): Promise<AuthenticatedUserInterface | ApiErrorInterface> => {
    let persistedUser: UserInterface | null;
    let encodedToken: string;

    try {
        logger.trace(`(login) - Looking for user with username '${username}'.`);

        persistedUser = await adapters.getUserByUsername(username);

        if (!persistedUser) {
            throw new Error(`User '${username}' not found.`);
        };

        if (!(await comparePassword(password, persistedUser.password))) {
            throw new Error(`Provided password doesn\'t match for username '${username}'.`);
        }

        logger.trace('(login) - User exist\'s and its password matchs.');

        logger.trace('(login) - Creating a new token.');
        encodedToken = encodeToken(persistedUser.username);

        logger.trace('(login) - Updating user\'s token.');
        adapters.updateUserToken(persistedUser.id, encodedToken);
        
        if (!persistedUser) {
            logger.error('(login) - Error updating user\'s token.');
            throw new Error('Updating token error.');
        };

        logger.trace('(login) - User\'s token updated successfully.');
        return {
            token: encodedToken,
            user: {
                id: persistedUser.id,
                name: persistedUser.name
            }
        };
    } catch (error) {
        logger.error('Authenticating user.', error.message);
        return new AuthenticationBadRequestError();
    }
};

export {
    login
};