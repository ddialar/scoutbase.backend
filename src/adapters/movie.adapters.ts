import { MovieInterface } from '@interfaces';
import { moviesRequests } from '@database/orm';

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getMovies = (movieIds: number[]): MovieInterface[] => {
    return moviesRequests.getMovies(movieIds);
};

export {
    getMovies
}