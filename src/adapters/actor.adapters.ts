import { ActorInterface } from '@interfaces';
import { actorsRequests } from '@database/orm';

// ###############################################################
// ##########            READING OPERATIONS             ##########
// ###############################################################

const getActorsByMovieId = (movieId: number): ActorInterface[] => {
    return actorsRequests.getActorsByMovieId(movieId);
};

export {
    getActorsByMovieId
}