import { 
    NewUserInterface,
    UserInterface
} from '@interfaces';
import orm from '@orm';
import { usersRequests } from '@database/orm';

// ###############################################################
// ##########           CREATING OPERATIONS             ##########
// ###############################################################

const createUser = async (newUserData: NewUserInterface): Promise<UserInterface | null> => {
    try {
        return await orm.createUser(newUserData);
    } catch (error) {
        throw error;
    }
};

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getUserByUsername = async (username: string): Promise<UserInterface | null> => {
    try {
        return await orm.getUserByUsername(username);
    } catch (error) {
        throw error;
    }
};

// ###############################################################
// ##########           UPDATING OPERATIONS             ##########
// ###############################################################

const updateUserToken = async (userId: number, newToken: string): Promise<UserInterface | null> => {
    try {
        return await orm.updateUserToken(userId, newToken);
    } catch (error) {
        throw error;
    }
};

export {
    createUser,
    getUserByUsername,
    updateUserToken
}