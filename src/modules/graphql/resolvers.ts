import AuthenticationResolvers from './models/authentication/authentication.resolver';
import UserResolvers           from './models/user/user.resolvers';
import MovieResolvers          from './models/movie/movie.resolvers';
import ActorResolvers          from './models/actor/actor.resolvers';

const Query = {
    ...MovieResolvers.Query
};

const Mutation = {
    ...AuthenticationResolvers.Mutation,
    ...UserResolvers.Mutation
};

export default {
    Query,
    Mutation,
    Movie: MovieResolvers.Movie,
    Actor: ActorResolvers.Actor
};