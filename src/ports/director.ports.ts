import logger                from '@logger';
import { DirectorInterface } from '@interfaces';
import * as adapters         from '@adapters';

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getDirectorsByMovieId = (movieId: number): DirectorInterface[] => {
    logger.trace(`(ports) - Retreaving directors for the movie with ID: ${movieId}.`);
    return adapters.getDirectorsByMovieId(movieId);
};

export {
    getDirectorsByMovieId
}