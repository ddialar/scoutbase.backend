import movies        from '@database/data/movies';
import { getMovies } from '@adapters';

describe('Testing Movie adapters ...', () => {
    describe('working with \'getMovies\' ...', () => {
        test('with no movie IDs provided, it must return all movies.', () => {
            let movieIds = null;
            let expectedResult = movies;
            let obtainedResult = getMovies(movieIds);

            expect(obtainedResult).toHaveLength(expectedResult.length);
        });
        test('with empty movie IDs set provided, it must return all movies.', () => {
            let movieIds = null;
            let expectedResult = movies;
            let obtainedResult = getMovies(movieIds);

            expect(obtainedResult).toHaveLength(expectedResult.length);
        });
        test('providing a single movie ID, it must return the specific movie.', () => {
            let movieIds = [3];
            let expectedResult = movieIds.map(movieId => movies.find(movie => (movie.id === movieId)));
            let obtainedResult = getMovies(movieIds);
            
            expect(obtainedResult).not.toBeNull();
            expect(obtainedResult.length).toBe(1);
            expect(obtainedResult[0]).toHaveProperty('id');
            expect(obtainedResult[0].id).toBe(expectedResult[0].id);
            expect(obtainedResult[0]).toHaveProperty('title');
            expect(obtainedResult[0].title).toBe(expectedResult[0].title);
            expect(obtainedResult[0]).toHaveProperty('year');
            expect(obtainedResult[0].year).toBe(expectedResult[0].year);
            expect(obtainedResult[0]).toHaveProperty('rating');
            expect(obtainedResult[0].rating).toBe(expectedResult[0].rating);
        });
        test('providing several movie IDs, it must return the specified movies.', () => {
            let movieIds = [3, 6];
            let expectedResult = movieIds.map(movieId => movies.find(movie => (movie.id === movieId)));
            let obtainedResult = getMovies(movieIds);
            
            expect(obtainedResult).not.toBeNull();
            expect(obtainedResult.length).toBe(2);
            obtainedResult.map((obtainedMovie, index) => {
                expect(obtainedMovie).toHaveProperty('id');
                expect(obtainedMovie.id).toBe(expectedResult[index].id);
                expect(obtainedMovie).toHaveProperty('title');
                expect(obtainedMovie.title).toBe(expectedResult[index].title);
                expect(obtainedMovie).toHaveProperty('year');
                expect(obtainedMovie.year).toBe(expectedResult[index].year);
                expect(obtainedMovie).toHaveProperty('rating');
                expect(obtainedMovie.rating).toBe(expectedResult[index].rating);
            });
        });
    });
});