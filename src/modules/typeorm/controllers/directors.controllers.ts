import logger               from '@logger';

import { getManager }       from 'typeorm';
import { directors  }       from '@entities/directors';
import { movies_directors } from '@entities/movies_directors';
import { actors_directors } from '@entities/actors_directors';

const getDirectorsByMovieId = async (movieId: number): Promise<directors[]> => {
    try {
        let obtainedDirectors = await getManager()
            .getRepository(directors)
            .createQueryBuilder('directors')
            .leftJoinAndSelect(movies_directors, 'movies_directors', 'movies_directors.director_id = directors.id')
            .where('movies_directors.movie_id = :movieId', { movieId })
            .getMany();

        return obtainedDirectors as directors[] || [];
    } catch (error) {
        logger.error('(orm) - (getDirectorsByMovieId) -', error.message);
        return [];
    }
};

const getDirectorsByActorId = async (actorId: number): Promise<directors[]> => {
    try {
        let obtainedDirectors = await getManager()
            .getRepository(directors)
            .createQueryBuilder('directors')
            .leftJoinAndSelect(actors_directors, 'actors_directors', 'actors_directors.director_id = directors.id')
            .where('actors_directors.actor_id = :actorId', { actorId })
            .getMany();

        return obtainedDirectors as directors[] || [];
    } catch (error) {
        logger.error('(orm) - (getDirectorsByActorId) -', error.message);
        return [];
    }
};

export {
    getDirectorsByMovieId,
    getDirectorsByActorId
}