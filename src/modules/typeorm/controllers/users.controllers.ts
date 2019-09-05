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

export {
    getUserByUsername
}