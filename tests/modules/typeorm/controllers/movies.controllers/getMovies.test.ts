import * as dotenv from 'dotenv';
import * as path   from 'path';
dotenv.config({ path: path.join(process.env.PWD, '/config/.env/test.env') });

import { 
    connect,
    disconnect,
    getAllMovies
} from '@orm';

const mockedData = [
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

describe('Testing ORM ...', () => {
    describe('working with \'getAllMovies\' ...', () => {
        test('providing several movie IDs, it must return the specified movies.', async () => {
            let expectedResult = mockedData;
            let obtainedResult = await getAllMovies();

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