import { DirectorInterface } from '@interfaces';
import { directorsRequests } from '@database/orm';

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getDirectorsByMovieId = (movieId: number): DirectorInterface[] => {
    return directorsRequests.getDirectorsByMovieId(movieId);
};

const getDirectorsByActorId = (actorId: number): DirectorInterface[] => {
    return directorsRequests.getDirectorsByActorId(actorId);
};

export {
    getDirectorsByMovieId,
    getDirectorsByActorId
}