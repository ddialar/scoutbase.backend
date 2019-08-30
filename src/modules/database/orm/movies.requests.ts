import { MovieInterface } from '@interfaces';

import movies from '../data/movies';
import relationships from '../data/relationships';

const getMovies = (movieIds: number[] | null): MovieInterface[] => {
    let result = [];
    if (movieIds && movieIds.length > 0) {
        result = movieIds.map(movieId => {
            let foundMovie = movies.find((movie) => movie.id === movieId);
            return (foundMovie) ? [foundMovie] : [];
        });
        result = result.flatMap(movie => movie);
    } else {
        result = movies;
    }

    return result as MovieInterface[];
};

export {
    getMovies
};

