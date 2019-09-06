import logger             from '@logger';
import { MovieInterface } from '@interfaces';
import * as adapters      from '@adapters';

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getMovies = async (movieIds: number[]): Promise<MovieInterface[]> => {
    logger.trace('(ports) - Retreaving movies.');
    return await adapters.getMovies(movieIds);
};

export {
    getMovies
}