import { MovieInterface } from '@interfaces';
import orm                from '@orm';

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getMovies = async (movieIds: number[]): Promise<MovieInterface[]> => {
    return await orm.getAllMovies();
};

export {
    getMovies
}