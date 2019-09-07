import logger               from '@logger';

import { 
    getManager, 
    InsertResult 
} from 'typeorm';
import { Users }            from '@entities/Users';
import { NewUserInterface } from '@interfaces'

// ###############################################################
// ##########           CREATING OPERATIONS             ##########
// ###############################################################

const createUser = async (newUserData: NewUserInterface): Promise<Users | null> => {
    try {
        let newUserId = await getManager()
            .getRepository(Users)
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

const getUserById = async (userId: number): Promise<Users | null> => {
    try {
        if (!userId) {
            throw new Error('User identification not valid.');
        }
        let obtainedUser = await getManager()
            .getRepository(Users)
            .findOne(userId);

        return obtainedUser || null;
    } catch (error) {
        logger.error('(orm) - (getUserById) -', error.message);
        throw error;
    }
};

const getUserByUsername = async (username: string): Promise<Users | null> => {
    try {
        let obtainedUser = await getManager()
            .getRepository(Users)
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

const updateUserToken = async (userId: number, newToken: string): Promise<Users | null> => {
    try {
        await getManager()
            .getRepository(Users)
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
    getUserById,
    getUserByUsername,
    updateUserToken
}