import logger            from '@logger';

import { getManager }    from 'typeorm';
import { users }         from '@entities/users';

// ###############################################################
// ##########           CREATING OPERATIONS             ##########
// ###############################################################


// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getUserByUsername = async (username: string): Promise<users | null> => {
    try {
        let obtainedUser = await getManager()
            .getRepository(users)
            .findOneOrFail({ where: { username }});

        return obtainedUser || null;
    } catch (error) {
        logger.error('(orm) - (getUserByUsername) -', error.message);
        return null;
    }
};

// ###############################################################
// ##########           UPDATING OPERATIONS             ##########
// ###############################################################

const updateUserToken = async (userId: number, newToken: string): Promise<users | null> => {
    try {
        let updatedUser = await getManager()
            .getRepository(users)
            .createQueryBuilder()
            .update()
            .set({ token: newToken })
            .where('id = :id', { id: userId })
            .execute();

        logger.trace(updatedUser);
        // return updatedUser || null;
        return null;
    } catch (error) {
        logger.error('(orm) - (getUserByUsername) -', error.message);
        return null;
    }
};

export {
    getUserByUsername,
    updateUserToken
}