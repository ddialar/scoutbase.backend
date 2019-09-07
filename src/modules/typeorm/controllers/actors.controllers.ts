import logger            from '@logger';

import { getManager }    from 'typeorm';
import { Actors }        from '@entities/Actors';
import { MoviesActors } from '@entities/MoviesActors';

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getActorsByMovieId = async (movieId: number): Promise<Actors[]> => {
    try {
        let obtainedActors = await getManager()
            .getRepository(Actors)
            .createQueryBuilder('Actors')
            .leftJoinAndSelect(MoviesActors, 'MoviesActors', 'MoviesActors.actor_id = Actors.id')
            .where('MoviesActors.movie_id = :movieId', { movieId })
            .getMany();

        return obtainedActors as Actors[] || [];
    } catch (error) {
        logger.error('(orm) - (getActorsByMovieId) -', error.message);
        return [];
    }
};

export {
    getActorsByMovieId
}