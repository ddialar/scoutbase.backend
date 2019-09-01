import { UserInterface } from '@interfaces';
import users             from '@database/data/users';

// // ###############################################################
// // ##########            READING OPERATIONS             ##########
// // ###############################################################

const getUserByUsername = (username: string): UserInterface | null => {
    let selectedUser = users.find(user => user.username === username);
    return (selectedUser) ? selectedUser : null;
};

// // ###############################################################
// // ##########           UPDATING OPERATIONS             ##########
// // ###############################################################

const updateUserToken = (userId: number, newToken: string): UserInterface | null => {
    // TODO: Check if the token is valida (not empty string).
    let selectedUser = users.find(user => {
        if (user.id === userId) {
            user.token = newToken;
            return user;
        }
    });
    return (selectedUser) ? selectedUser : null;
};

export {
    getUserByUsername,
    updateUserToken
};

