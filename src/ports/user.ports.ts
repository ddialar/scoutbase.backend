import { 
    NewUserInterface,
    AuthenticatedUserInterface
} from '@interfaces';
import { encodePassword } from '@services/password.services';
import { encodeToken }    from '@services/token.services';
import * as adapters      from '@adapters';

// ###############################################################
// ##########          CREATING OPERATIONS              ##########
// ###############################################################

const createUser = async (newUserData: NewUserInterface): Promise<AuthenticatedUserInterface> => {
    newUserData.password = await encodePassword(newUserData.password);

    let createdUser = adapters.createUser(newUserData);
    let createdUserToken = encodeToken(createdUser.username)
    adapters.updateUserToken(createdUser.id, createdUserToken);

    return {
        token: createdUserToken,
        user: {
            id: createdUser.id,
            name: createdUser.name
        }
    }
};

export {
    createUser
}