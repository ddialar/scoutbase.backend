import { 
    MovieInterface,
    ActorInterface,
    DirectorInterface
} from '@interfaces';
import * as ports from '@ports';

export default {
    Movie: {
        actors: async (parentValue: any, args: any, context: any, astData: any): Promise<ActorInterface[]> => {
            return await ports.getActorsByMovieId(parentValue.id);
        },
        directors: async (parentValue: any, args: any, context: any, astData: any): Promise<DirectorInterface[]> => {
            return await ports.getDirectorsByMovieId(parentValue.id);
        },
        scoutbase_rating: (parentValue: any, args: any, context: any, astData: any): string => {
            return (Math.random() * (9.0 - 5.0) + 5.0).toFixed(1).toString();
        }
    },
    Query: {
        movies: async (parentValue: any, args: any, context: any, astData: any): Promise<MovieInterface[]> => {
            return await ports.getAllMovies();
        }
    }
};
