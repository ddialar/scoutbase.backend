import { ActorInterface } from '@interfaces';
import orm                from '@orm';

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getActorsByMovieId = async (movieId: number): Promise<ActorInterface[]> => {
    return await orm.getActorsByMovieId(movieId);
};

export {
    getActorsByMovieId
}   