import MovieResolvers from './models/movie/movie.resolvers';
import ActorResolvers from './models/actor/actor.resolvers';

const Query = {
    ...MovieResolvers.Query
};

export default {
    Query,
    Movie: MovieResolvers.Movie,
    Actor: ActorResolvers.Actor
};