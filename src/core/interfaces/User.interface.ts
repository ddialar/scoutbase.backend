export interface UserInterface {
    id: number,
    name: string,
    surname: string,
    username: string,
    password: string,
    token: string
};

export interface AuthenticatedUserInterface {
    token: String
    user: Pick<UserInterface, 'id' | 'name'>
};

