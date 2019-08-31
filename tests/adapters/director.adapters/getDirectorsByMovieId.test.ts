import movies                    from '@database/data/movies';
import { getDirectorsByMovieId } from '@adapters';

describe('Testing Director adapters ...', () => {
    describe('working with \'getActorsByMovieId\' ...', () => {
        test('with no movie ID provided, it must return an empty collection.', () => {
            let movieId = null;
            let expectedResult = [];
            let obtainedResult = getDirectorsByMovieId(movieId);

            expect(obtainedResult).toHaveLength(expectedResult.length);
        });
        test('providing a non recorded movie ID, it must return an empty collection.', () => {
            let movieId = 99;
            let expectedResult = [];
            let obtainedResult = getDirectorsByMovieId(movieId);

            expect(obtainedResult).toHaveLength(expectedResult.length);
        });
        test('providing a movie ID, it must return all directors bound with this movie.', () => {
            let movieId = 6;
            let expectedResult = [
                {
                    "id": 5,
                    "name": "Lana Wachowski",
                    "birthday": "1965-06-21",
                    "country": "United States"
                },
                {
                    "id": 6,
                    "name": "Lilly Wachowski",
                    "birthday": "1967-12-29",
                    "country": "United States"
                }
            ];
            let obtainedResult = getDirectorsByMovieId(movieId);

            expect(obtainedResult).not.toBeNull();
            expect(obtainedResult).toHaveLength(expectedResult.length)
            obtainedResult.map((obtainedDirector, index) => {
                expect(obtainedDirector).toHaveProperty('id');
                expect(obtainedDirector.id).toBe(expectedResult[index].id);
                expect(obtainedDirector).toHaveProperty('name');
                expect(obtainedDirector.name).toBe(expectedResult[index].name);
                expect(obtainedDirector).toHaveProperty('birthday');
                expect(obtainedDirector.birthday).toBe(expectedResult[index].birthday);
                expect(obtainedDirector).toHaveProperty('country');
                expect(obtainedDirector.country).toBe(expectedResult[index].country);
            });
        });
    });
});