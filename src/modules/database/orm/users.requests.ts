import { 
    NewUserInterface,
    UserInterface
} from '@interfaces';
import users from '@database/data/users';

// TODO: Implement the data storaging into a JSON file providing disk persistance.

// ###############################################################
// ##########           CREATING OPERATIONS             ##########
// ###############################################################

const createUser = (newUserData: NewUserInterface): UserInterface => {
    try {
        let newUserId = users.length++;
        let newUser = {
            id: newUserId,
            token: '',
            surname: '',
            ...newUserData
        };
        users.push(newUser);

        return newUser;
    } catch (error) {
        throw error;
    }
};

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getUserByUsername = (username: string): UserInterface | null => {
    let selectedUser = users.find(user => user.username === username);
    return (selectedUser) ? selectedUser : null;
};

// ###############################################################
// ##########           UPDATING OPERATIONS             ##########
// ###############################################################

const updateUserToken = (userId: number, newToken: string): UserInterface | null => {
    let selectedUser = users.find(user => {
        if (user.id === userId) {
            user.token = newToken;
            return user;
        }
    });
    return (selectedUser) ? selectedUser : null;
};

export {
    createUser,
    getUserByUsername,
    updateUserToken
};

