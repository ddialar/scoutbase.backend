import logger                from '@logger';
import { DirectorInterface } from '@interfaces';
import * as adapters         from '@adapters';

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getDirectorsByMovieId = async (movieId: number): Promise<DirectorInterface[]> => {
    logger.trace(`(ports) - Retreaving directors for the movie with ID: ${movieId}.`);
    return await adapters.getDirectorsByMovieId(movieId);
};

const getDirectorsByActorId = async (actorId: number):Promise<DirectorInterface[]> => {
    logger.trace(`(ports) - Retreaving directors for the actor with ID: ${actorId}.`);
    return await adapters.getDirectorsByActorId(actorId);
};

export {
    getDirectorsByMovieId,
    getDirectorsByActorId
}