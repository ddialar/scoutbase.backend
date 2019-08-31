import { DirectorInterface } from '@interfaces';

import directors             from '@database/data/directors';
import relationships         from '@database/data/relationships';

interface DirectorMovieInterface {
    id: number,
    directorId: number,
    movieId: number
};

const getDirectorsByMovieId = (movieId: number | null): DirectorInterface[] => {
    if (movieId) {
        let directorIdsBoundToMovie: DirectorMovieInterface[] = relationships.movies_directors.filter(relationship => relationship.movieId === movieId);
        let obtainedDirectors = directorIdsBoundToMovie.map(boundDirector => [directors.find(director => director.id === boundDirector.directorId)]);
        return obtainedDirectors.flatMap(director => director) as DirectorInterface[];
    } else {
        return [];
    }
};

export {
    getDirectorsByMovieId
};

