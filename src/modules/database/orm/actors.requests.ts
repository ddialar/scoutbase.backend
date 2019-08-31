import { ActorInterface } from '@interfaces';

import actors             from '@database/data/actors';
import relationships      from '@database/data/relationships';

interface ActorMovieInterface {
    id: number,
    actorId: number,
    movieId: number
};

const getActorsByMovieId = (movieId: number | null): ActorInterface[] => {
    if (movieId) {
        let actorIdsBoundToMovie: ActorMovieInterface[] = relationships.movies_actors.filter(relationship => relationship.movieId === movieId);
        let obtainedActors = actorIdsBoundToMovie.map(boundActor => [actors.find(actor => actor.id === boundActor.actorId)]);
        return obtainedActors.flatMap(actor => actor) as ActorInterface[];
    } else {
        return [];
    }
};

export {
    getActorsByMovieId
};

