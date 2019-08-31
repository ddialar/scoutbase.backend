import * as dotenv               from 'dotenv';
import * as path                 from 'path';
dotenv.config({ path: path.join(process.env.PWD, '/config/.env/test.env') });

import movies                    from '@database/data/movies';
import { getDirectorsByActorId } from '@ports';

describe('Testing Director adapters ...', () => {
    describe('working with \'getDirectorsByActorId\' ...', () => {
        test('with no actor ID provided, it must return an empty collection.', () => {
            let actorId = null;
            let expectedResult = [];
            let obtainedResult = getDirectorsByActorId(actorId);

            expect(obtainedResult).toHaveLength(expectedResult.length);
        });
        test('providing a non recorded actor ID, it must return an empty collection.', () => {
            let actorId = 99;
            let expectedResult = [];
            let obtainedResult = getDirectorsByActorId(actorId);

            expect(obtainedResult).toHaveLength(expectedResult.length);
        });
        test('providing a actor ID, it must return all directors bound with this actor.', () => {
            let actorId = 1;
            let expectedResult = [
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
            let obtainedResult = getDirectorsByActorId(actorId);

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