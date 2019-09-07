import logger               from '@logger';

import { getManager }      from 'typeorm';
import { Directors  }      from '@entities/Directors';
import { MoviesDirectors } from '@entities/MoviesDirectors';
import { ActorsDirectors } from '@entities/ActorsDirectors';

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getDirectorsByMovieId = async (movieId: number): Promise<Directors[]> => {
    try {
        if (!movieId) {
            throw new Error('Movie identification not valid.');
        }

        let obtainedDirectors = await getManager()
            .getRepository(Directors)
            .createQueryBuilder('Directors')
            .leftJoinAndSelect(MoviesDirectors, 'MoviesDirectors', 'MoviesDirectors.director_id = Directors.id')
            .where('MoviesDirectors.movie_id = :movieId', { movieId })
            .getMany();

        return obtainedDirectors as Directors[];
    } catch (error) {
        logger.error('(orm) - (getDirectorsByMovieId) -', error.message);
        throw error;
    }
};

const getDirectorsByActorId = async (actorId: number): Promise<Directors[]> => {
    try {
        if (!actorId) {
            throw new Error('Actor identification not valid.');
        }

        let obtainedDirectors = await getManager()
            .getRepository(Directors)
            .createQueryBuilder('Directors')
            .leftJoinAndSelect(ActorsDirectors, 'ActorsDirectors', 'ActorsDirectors.director_id = Directors.id')
            .where('ActorsDirectors.actor_id = :actorId', { actorId })
            .getMany();

        return obtainedDirectors as Directors[];
    } catch (error) {
        logger.error('(orm) - (getDirectorsByActorId) -', error.message);
        throw error;
    }
};

export {
    getDirectorsByMovieId,
    getDirectorsByActorId
}