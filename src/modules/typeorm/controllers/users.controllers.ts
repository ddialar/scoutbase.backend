import logger               from '@logger';

import { 
    getManager, 
    InsertResult 
} from 'typeorm';
import { users }            from '@entities/users';
import { NewUserInterface } from '@interfaces'

// ###############################################################
// ##########           CREATING OPERATIONS             ##########
// ###############################################################

const createUser = async (newUserData: NewUserInterface): Promise<users | null> => {
    try {
        let newUserId = await getManager()
            .getRepository(users)
            .insert(newUserData)
            .then((result: InsertResult) => {
                return result.identifiers[0].id;
            });

        return getUserById(newUserId);
    } catch (error) {
        logger.error('(orm) - (getUserByUsername) -', error.message);
        throw error;
    }
};

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getUserById = async (userId: number): Promise<users | null> => {
    try {
        let obtainedUser = await getManager()
            .getRepository(users)
            .findOne(userId);

        return obtainedUser || null;
    } catch (error) {
        logger.error('(orm) - (getUserById) -', error.message);
        throw error;
    }
};

const getUserByUsername = async (username: string): Promise<users | null> => {
    try {
        let obtainedUser = await getManager()
            .getRepository(users)
            .findOne({ where: { username }});

        return obtainedUser || null;
    } catch (error) {
        logger.error('(orm) - (getUserByUsername) -', error.message);
        throw error;
    }
};

// ###############################################################
// ##########           UPDATING OPERATIONS             ##########
// ###############################################################

const updateUserToken = async (userId: number, newToken: string): Promise<users | null> => {
    try {
        await getManager()
            .getRepository(users)
            .createQueryBuilder()
            .update()
            .set({ token: newToken })
            .where('id = :id', { id: userId })
            .execute();

        return getUserById(userId);
    } catch (error) {
        logger.error('(orm) - (getUserByUsername) -', error.message);
        throw error;
    }
};

export {
    createUser,
    getUserByUsername,
    updateUserToken
}