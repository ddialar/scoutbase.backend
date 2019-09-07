import { 
    NewUserInterface,
    UserInterface
} from '@interfaces';
import orm from '@orm';

// ###############################################################
// ##########           CREATING OPERATIONS             ##########
// ###############################################################

const createUser = async (newUserData: NewUserInterface): Promise<UserInterface | null> => {
    return await orm.createUser(newUserData);
};

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getUserByUsername = async (username: string): Promise<UserInterface | null> => {
    return await orm.getUserByUsername(username);
};

// ###############################################################
// ##########           UPDATING OPERATIONS             ##########
// ###############################################################

const updateUserToken = async (userId: number, newToken: string): Promise<UserInterface | null> => {
    return await orm.updateUserToken(userId, newToken);
};

export {
    createUser,
    getUserByUsername,
    updateUserToken
}