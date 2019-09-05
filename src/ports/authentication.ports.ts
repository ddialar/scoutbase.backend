import logger              from '@logger';

import { comparePassword } from '@services/password.services';
import { encodeToken }     from '@services/token.services';
import {
    UserInterface,
    AuthenticatedUserInterface
} from '@interfaces';

import * as adapters from '@adapters';

const login = async (username: string, password: string): Promise<AuthenticatedUserInterface> => {
    let persistedUser: UserInterface | null;
    let encodedToken: string;

    try {
        logger.trace(`(login) - Looking for user with username '${username}'.`);

        persistedUser = await adapters.getUserByUsername(username);

        if (!persistedUser) {
            throw new Error('User not found.');
        };

        // TODO: Compare the provided password with the persisted one.
        if (!(await comparePassword(password, persistedUser.password))) {
            throw new Error(`Password '${password}' doesn\'t match.`);
        }

        logger.trace('(login) - User exist\'s and its password matchs.');

        logger.trace('(login) - Creating a new token.');
        encodedToken = encodeToken(persistedUser.username);

        logger.trace('(login) - Updating user\'s token.');
        // persistedUser = adapters.updateUserToken(persistedUser.id, encodedToken);
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
        throw new Error(`Authenticating user. ${error.message}`);
    }
};

// const logout = async (userToken: string): Promise<SimpleResponse | ApiError> => {
//     let persistedUser: User | ApiError;

//     try {
//         logger.trace('(logout) - Looking for user by token');
//         persistedUser = await adapters.getUserByToken(userToken);
//         if (persistedUser instanceof ApiError) {
//             logger.error('(logout) - Token error.', persistedUser.message);
//             return persistedUser
//         };

//         logger.trace('(logout) - User exist\'s.');

//         logger.trace('(logout) - Deleting user\'s token.');
//         persistedUser = await adapters.updateUserToken(persistedUser.id, '');
//         if (persistedUser instanceof ApiError) {
//             logger.error('(login) - Error removing user\'s token.', persistedUser.message);
//             return persistedUser
//         };

//         logger.trace('(logout) - User\'s token deleted successfully.');
//         return new SimpleResponse();
//     } catch (error) {
//         return new LogoutError(error.message);
//     }
// };

export {
    login,
    // logout
};