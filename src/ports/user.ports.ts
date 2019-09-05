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
    let createdUser;
    let createdUserToken;
    
    newUserData.password = await encodePassword(newUserData.password);

    createdUser = await adapters.createUser(newUserData);
    if (createdUser) {
        createdUserToken = encodeToken(createdUser.username)
        adapters.updateUserToken(createdUser.id, createdUserToken);
    }

    return {
        token: createdUserToken || 'token error',
        user: {
            id: (createdUser) ? createdUser.id : 99,
            name: (createdUser) ? createdUser.name : 'name error'
        }
    }
};

export {
    createUser
}