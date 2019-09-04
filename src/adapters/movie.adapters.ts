import { MovieInterface } from '@interfaces';
import { moviesRequests } from '@database/orm';
import orm                from '@orm';

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getMovies = async (movieIds: number[]): Promise<MovieInterface[]> => {
    return await orm.getAllMovies();
    // return moviesRequests.getMovies(movieIds);
};

export {
    getMovies
}