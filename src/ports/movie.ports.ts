import logger             from '@logger';
import { MovieInterface } from '@interfaces';
import * as adapters      from '@adapters';

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getMovies = (movieIds: number[]): MovieInterface[] => {
    logger.trace('(ports) - Retreaving movies.');
    return adapters.getMovies(movieIds);
};

export {
    getMovies
}