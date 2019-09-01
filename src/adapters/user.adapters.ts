import { 
    NewUserInterface,
    UserInterface
} from '@interfaces';
import { usersRequests } from '@database/orm';

// ###############################################################
// ##########           CREATING OPERATIONS             ##########
// ###############################################################

const createUser = (newUserData: NewUserInterface): UserInterface => {
    try {
        return usersRequests.createUser(newUserData);
    } catch (error) {
        throw error;
    }
};

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getUserByUsername = (username: string): UserInterface | null => {
    try {
        return usersRequests.getUserByUsername(username);
    } catch (error) {
        throw error;
    }
};

// ###############################################################
// ##########           UPDATING OPERATIONS             ##########
// ###############################################################

const updateUserToken = (userId: number, newToken: string): UserInterface | null => {
    try {
        return usersRequests.updateUserToken(userId, newToken);
    } catch (error) {
        throw error;
    }
};

export {
    createUser,
    getUserByUsername,
    updateUserToken
}