import * as dotenv from 'dotenv';
import * as path   from 'path';
dotenv.config({ path: path.join(process.env.PWD, '/config/.env/test.env') });

import orm from '@orm';

const mockedMovieId = 6;
const mockedDirectorsData = [
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

beforeAll(async (done) => {
    try {
        await orm.connect();
    } catch (error) {
        console.log(`[ERROR] (getDirectorsByMovieId) - Connecting the database: ${error.message}`);
    } finally {
        done();
    }
});

afterAll(async (done) => {
    try {
        await orm.disconnect();
    } catch (error) {
        console.log(`[ERROR] (getDirectorsByMovieId) - Disconnecting the database: ${error.message}`);
    } finally {
        done();
    }
});

describe('Testing ORM ...', () => {
    describe('working with \'getDirectorsByMovieId\' ...', () => {
        test('with no movie ID provided, it must return an empty collection.', () => {
            let movieId = null;

            expect(orm.getDirectorsByMovieId(movieId)).rejects.toThrow('Movie identification not valid.');
        });
        test('providing a non recorded movie ID, it must return an empty collection.', async (done) => {
            let movieId = 99;
            let expectedResult = [];
            let obtainedResult = await orm.getDirectorsByMovieId(movieId);

            expect(obtainedResult).toHaveLength(expectedResult.length);

            done();
        });
        test('providing a movie ID, it must return all directors bound with this movie.', async (done) => {
            let movieId = mockedMovieId;
            let expectedResult = mockedDirectorsData;
            let obtainedResult = await orm.getDirectorsByMovieId(movieId);

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

            done();
        });
    });
});