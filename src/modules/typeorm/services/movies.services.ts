import logger         from '@logger';

import { getManager, getConnection } from 'typeorm';
import { movies }     from '../models/entities/movies';

const getAllMovies = async (): Promise<movies[]> => {
    try {
        let obtainedMovies = await getManager().getRepository(movies).find();
        return obtainedMovies || [];
    } catch (error) {
        logger.error('(orm) - (getAllMovies) -', error.message);
        return [];
    }
};

export {
    getAllMovies
}