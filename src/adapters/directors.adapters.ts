import { DirectorInterface } from '@interfaces';
import orm                   from '@orm';

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getDirectorsByMovieId = async (movieId: number): Promise<DirectorInterface[]> => {
    return await orm.getDirectorsByMovieId(movieId);
};

const getDirectorsByActorId = async (actorId: number): Promise<DirectorInterface[]> => {
    return await orm.getDirectorsByActorId(actorId);
};

export {
    getDirectorsByMovieId,
    getDirectorsByActorId
}