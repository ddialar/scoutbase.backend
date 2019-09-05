import logger            from '@logger';

import { getManager, Brackets }    from 'typeorm';
import { actors }        from '@entities/actors';
import { movies_actors } from '@entities/movies_actors';

const getActorsByMovieId = async (movieId: number): Promise<actors[]> => {
    try {
        let obtainedActors = await getManager()
            .getRepository(actors)
            .createQueryBuilder('actors')
            .leftJoinAndSelect(movies_actors, 'movies_actors', 'movies_actors.actor_id = actors.id')
            .where('movies_actors.movie_id = :movieId', { movieId })
            .getMany();

        return obtainedActors as actors[] || [];
    } catch (error) {
        logger.error('(orm) - (getAllMovies) -', error.message);
        return [];
    }
};

export {
    getActorsByMovieId
}