import actors             from '@database/data/actors';
import { actorsRequests } from '@database/orm';

describe('Testing ORM ...', () => {
    describe('working with \'getActorsByMovieId\' ...', () => {
        test('with no movie ID provided, it must return an empty collection.', () => {
            let movieId = null;
            let expectedResult = [];
            let obtainedResult = actorsRequests.getActorsByMovieId(movieId);

            expect(obtainedResult).toHaveLength(expectedResult.length);
        });
        test('providing a non recorded movie ID, it must return an empty collection.', () => {
            let movieId = 99;
            let expectedResult = [];
            let obtainedResult = actorsRequests.getActorsByMovieId(movieId);

            expect(obtainedResult).toHaveLength(expectedResult.length);
        });
        test('providing a movie ID, it must return all actors bound with this movie.', () => {
            let movieId = 2;
            let expectedResult = [
                {
                  "id": 1,
                  "name": "Benedict Cumberbatch",
                  "birthday": "1976-06-19",
                  "country": "United Kingdom"
                },
                {
                  "id": 2,
                  "name": "Chiwetel Ejiofor",
                  "birthday": "1977-07-10",
                  "country": "United Kingdom"
                },
                {
                  "id": 3,
                  "name": "Rachel McAdams",
                  "birthday": "1978-11-17",
                  "country": "Canada"
                },
                {
                  "id": 4,
                  "name": "Benedict Wong",
                  "birthday": "1971-06-03",
                  "country": "United Kingdom"
                },
                {
                  "id": 5,
                  "name": "Tilda Swinton",
                  "birthday": "1960-11-05",
                  "country": "United Kingdom"
                }
            ];
            let obtainedResult = actorsRequests.getActorsByMovieId(movieId);
            
            expect(obtainedResult).not.toBeNull();
            expect(obtainedResult).toHaveLength(expectedResult.length)
            obtainedResult.map((obtainedActor, index) => {
                expect(obtainedActor).toHaveProperty('id');
                expect(obtainedActor.id).toBe(expectedResult[index].id);
                expect(obtainedActor).toHaveProperty('name');
                expect(obtainedActor.name).toBe(expectedResult[index].name);
                expect(obtainedActor).toHaveProperty('birthday');
                expect(obtainedActor.birthday).toBe(expectedResult[index].birthday);
                expect(obtainedActor).toHaveProperty('country');
                expect(obtainedActor.country).toBe(expectedResult[index].country);
            });
        });
    });
});