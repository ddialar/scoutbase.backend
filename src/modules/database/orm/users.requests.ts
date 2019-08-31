import { UserInterface } from '@interfaces';
import users             from '@database/data/users';

const getUserByUsername = (username: string): UserInterface | null => {
    let selectedUser = users.find(user => user.username === username);
    return (selectedUser) ? selectedUser : null;
};

export {
    getUserByUsername
};

