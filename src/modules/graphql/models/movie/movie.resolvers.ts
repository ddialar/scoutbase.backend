import { MovieInterface } from '@interfaces';
import * as ports         from '@ports';

export default {
    Query: {
        movies: (parentValue: any, args: any, context: any, astData: any): MovieInterface[] => {
            return ports.getMovies(args.movieIds || []);
        }
    }
};
