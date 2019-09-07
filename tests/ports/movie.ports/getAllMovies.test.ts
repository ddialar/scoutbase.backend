import * as dotenv from 'dotenv';
import * as path   from 'path';
dotenv.config({ path: path.join(process.env.PWD, '/config/.env/test.env') });

import orm                from '@orm';
import { MovieInterface } from '@interfaces';
import { getAllMovies }   from '@ports';

const mockedData: MovieInterface[] = [
    {
        "id": 1,
        "title": "The Imitation Game",
        "year": 2014,
        "rating": 5
    },
    {
        "id": 2,
        "title": "Doctor Strange",
        "year": 1982,
        "rating": 7.6
    },
    {
        "id": 3,
        "title": "Blade Runner",
        "year": 1982,
        "rating": 8.3
    },
    {
        "id": 4,
        "title": "The Dark Knight",
        "year": 2008,
        "rating": 4.5
    },
    {
        "id": 5,
        "title": "Inception",
        "year": 2010,
        "rating": 4
    },
    {
        "id": 6,
        "title": "The Matrix",
        "year": 1999,
        "rating": 4
    }
];

beforeAll(async (done) => {
    try {
        await orm.connect();
    } catch (error) {
        console.log(`[ERROR] (getAllMovies) - Connecting the database: ${error.message}`);
    } finally {
        done();
    }
});

afterAll(async (done) => {
    try {
        await orm.disconnect();
    } catch (error) {
        console.log(`[ERROR] (getAllMovies) - Disconnecting the database: ${error.message}`);
    } finally {
        done();
    }
});

describe('Testing Movie ports ...', () => {
    describe('working with \'getMovies\' ...', () => {
        test('it must return all persisted movies.', async (done) => {
            let expectedResult = mockedData;
            let obtainedResult = await getAllMovies();

            expect(obtainedResult).not.toBeNull();
            expect(obtainedResult).toHaveLength(expectedResult.length);
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

            done();
        });
    });
});