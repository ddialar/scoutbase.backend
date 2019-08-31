import { DirectorInterface } from '@interfaces';
import { directorsRequests } from '@database/orm';

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getDirectorsByMovieId = (movieId: number): DirectorInterface[] => {
    return directorsRequests.getDirectorsByMovieId(movieId);
};

export {
    getDirectorsByMovieId
}