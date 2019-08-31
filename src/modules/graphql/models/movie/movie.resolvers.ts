import { 
    MovieInterface,
    ActorInterface
} from '@interfaces';
import * as ports from '@ports';

export default {
    Movie: {
        actors: (parentValue: any, args: any, context: any, astData: any): ActorInterface[] => {
            return ports.getActorsByMovieId(parentValue.id);
        }
    },
    Query: {
        movies: (parentValue: any, args: any, context: any, astData: any): MovieInterface[] => {
            return ports.getMovies(args.movieIds || []);
        }
    }
};
