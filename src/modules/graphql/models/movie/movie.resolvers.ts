import { 
    MovieInterface,
    ActorInterface
} from '@interfaces';
import * as ports from '@ports';

export default {
    Movie: {
        actors: (parentValue: any, args: any, context: any, astData: any): ActorInterface[] => {
            return ports.getActorsByMovieId(parentValue.id);
        },
        directors: (parentValue: any, args: any, context: any, astData: any): ActorInterface[] => {
            return ports.getDirectorsByMovieId(parentValue.id);
        },
        scoutbase_rating: (parentValue: any, args: any, context: any, astData: any): string => {
            return (Math.random() * (9.0 - 5.0) + 5.0).toFixed(1).toString();
        }
    },
    Query: {
        movies: async (parentValue: any, args: any, context: any, astData: any): Promise<MovieInterface[]> => {
            return await ports.getMovies(args.movieIds || []);
        }
    }
};
