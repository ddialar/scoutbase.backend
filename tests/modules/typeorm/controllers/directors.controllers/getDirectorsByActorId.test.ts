import * as dotenv from 'dotenv';
import * as path   from 'path';
dotenv.config({ path: path.join(process.env.PWD, '/config/.env/test.env') });

import orm                   from '@orm';
import { DirectorInterface } from '@interfaces';

const mockedActorId: number = 1;
const mockedDirectorsData: DirectorInterface[]= [
    {
        "id": 1,
        "name": "Morten Tyldum",
        "birthday": "1967-05-19",
        "country": "Norway"
    },
    {
        "id": 2,
        "name": "Scott Derrickson",
        "birthday": "1966-03-18",
        "country": "United States"
    }
];

beforeAll(async (done) => {
    try {
        await orm.connect();
    } catch (error) {
        console.log(`[ERROR] (getDirectorsByActorId) - Connecting the database: ${error.message}`);
    } finally {
        done();
    }
});

afterAll(async (done) => {
    try {
        await orm.disconnect();
    } catch (error) {
        console.log(`[ERROR] (getDirectorsByActorId) - Disconnecting the database: ${error.message}`);
    } finally {
        done();
    }
});

describe('Testing ORM ...', () => {
    describe('working with \'getDirectorsByActorId\' ...', () => {
        test('with no actor ID provided, it must return an empty collection.', async (done) => {
            let actorId = null;
            let expectedResult = [];
            let obtainedResult = await orm.getDirectorsByActorId(actorId);

            expect(obtainedResult).toHaveLength(expectedResult.length);

            done();
        });
        test('providing a non recorded actor ID, it must return an empty collection.', async (done) => {
            let actorId = 99;
            let expectedResult = [];
            let obtainedResult = await orm.getDirectorsByActorId(actorId);

            expect(obtainedResult).toHaveLength(expectedResult.length);

            done();
        });
        test('providing a actor ID, it must return all directors bound with this actor.', async (done) => {
            let actorId = mockedActorId;
            let expectedResult = mockedDirectorsData;
            let obtainedResult = await orm.getDirectorsByActorId(actorId);

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