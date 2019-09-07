import logger         from '@logger';

import { getManager } from 'typeorm';
import { Movies }     from '@entities/Movies';

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getAllMovies = async (): Promise<Movies[]> => {
    try {
        let obtainedMovies = await getManager()
            .getRepository(Movies)
            .find();
        return obtainedMovies || [];
    } catch (error) {
        logger.error('(orm) - (getAllMovies) -', error.message);
        throw error;
    }
};

export {
    getAllMovies
}