import logger             from '@logger';
import { ActorInterface } from '@interfaces';
import * as adapters      from '@adapters';

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getActorsByMovieId = async (movieId: number): Promise<ActorInterface[]> => {
    logger.trace(`(ports) - Retreaving actors for the movie with ID: ${movieId}.`);
    return await adapters.getActorsByMovieId(movieId);
};

export {
    getActorsByMovieId
}