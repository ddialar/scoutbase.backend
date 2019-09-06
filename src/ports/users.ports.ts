import logger             from '@logger';
import { encodePassword } from '@services/password.services';
import * as adapters      from '@adapters';
import { 
    NewUserInterface,
    UserInterface,
    ApiErrorInterface
} from '@interfaces';
import { 
    CreateNewUserBadRequestError,
    NewUserAlreadyExistsError,
    NewUserCreationError
} from '@apiErrors';

// ###############################################################
// ##########          CREATING OPERATIONS              ##########
// ###############################################################

const createUser = async (newUserData: NewUserInterface): Promise<UserInterface | ApiErrorInterface> => {
    try {
        let createdUser;

        if (await _userAlreadyExists(newUserData.username)) {
            return new NewUserAlreadyExistsError();
        }
        
        newUserData.password = await encodePassword(newUserData.password);

        createdUser = await adapters.createUser(newUserData);
        return (createdUser) ? createdUser : new NewUserCreationError();
    } catch (error) {
        logger.error(`(createUser) - ${error.message}`);
        return new CreateNewUserBadRequestError();
    }
};

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const _userAlreadyExists = async (username: string): Promise<boolean> => {
    let persistedUser = await adapters.getUserByUsername(username);
    return (!!persistedUser);
};

export {
    createUser
}