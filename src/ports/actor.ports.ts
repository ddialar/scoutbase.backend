import logger             from '@logger';
import { ActorInterface } from '@interfaces';
import * as adapters      from '@adapters';

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getActorsByMovieId = (movieId: number): ActorInterface[] => {
    logger.trace(`(ports) - Retreaving actors for the movie with ID: ${movieId}.`);
    return adapters.getActorsByMovieId(movieId);
};

export {
    getActorsByMovieId
}