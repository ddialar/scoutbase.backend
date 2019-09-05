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

const Unions = {
    ...AuthenticationResolvers.Unions,
    ...UserResolvers.Unions
};

export default {
    Query,
    Mutation,
    ...Unions,
    Movie: MovieResolvers.Movie,
    Actor: ActorResolvers.Actor
};