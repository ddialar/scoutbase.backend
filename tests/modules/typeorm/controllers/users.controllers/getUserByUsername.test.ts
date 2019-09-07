import * as dotenv from 'dotenv';
import * as path   from 'path';
dotenv.config({ path: path.join(process.env.PWD, '/config/.env/test.env') });

import orm         from '@orm';
import { Users }   from '@entities/Users';
import { 
    NewUserInterface,
    UserInterface
} from '@interfaces';
import { 
    getManager,
    InsertResult
} from 'typeorm';

var mockedUserId: number;
const mockedActorData: NewUserInterface = {
    name: 'TestActor',
    username: 'tactor',
    password: '$2a$04$ClyWJzl7mPUtaOgv.fvOhu9t5sqnCFeoH1KRab5omyvKAd3lRZt.y'
};

beforeAll(async (done) => {
    try {
        await orm.connect();
        mockedUserId = await getManager()
            .getRepository(Users)
            .insert(mockedActorData)
            .then((result: InsertResult) => {
                return result.identifiers[0].id;
            });
    } catch (error) {
        console.log(`[ERROR] (getUserByUsername) - Connecting the database: ${error.message}`);
    } finally {
        done();
    }
});

afterAll(async (done) => {
    try {
        await getManager()
            .getRepository(Users)
            .delete(mockedUserId);
        await orm.disconnect();
    } catch (error) {
        console.log(`[ERROR] (getUserByUsername) - Disconnecting the database: ${error.message}`);
    } finally {
        done();
    }
});

describe('Testing ORM ...', () => {
    describe('working with \'getUserByUsername\' ...', () => {
        test('with no username provided, it must return a NULL value.', async (done) => {
            let username: string = '';
            let obtainedResult = await orm.getUserByUsername(username);

            expect(obtainedResult).toBeNull();

            done();
        });
        test('providing a non recorded username, it must return a NULL value.', async (done) => {
            let username: string = 'nonpersistedusername';
            let obtainedResult = await orm.getUserByUsername(username);

            expect(obtainedResult).toBeNull();

            done();
        });
        test('providing a username, it must return the selected user data.', async (done) => {
            let username: string = mockedActorData.username;
            let expectedResult: UserInterface = {
                'id': mockedUserId,
                'name': mockedActorData.name,
                'username': mockedActorData.username,
                'password': mockedActorData.password,
                'token': ''
            };

            let obtainedResult = await orm.getUserByUsername(username);

            expect(obtainedResult).not.toBeNull();
            expect(obtainedResult).toHaveProperty('id');
            expect(obtainedResult.id).toBe(expectedResult.id);
            expect(obtainedResult).toHaveProperty('name');
            expect(obtainedResult.name).toBe(expectedResult.name);
            expect(obtainedResult).toHaveProperty('username');
            expect(obtainedResult.username).toBe(expectedResult.username);
            expect(obtainedResult).toHaveProperty('password');
            expect(obtainedResult.password).toBe(expectedResult.password);
            expect(obtainedResult).toHaveProperty('token');
            expect(obtainedResult.token).toBe(expectedResult.token);

            done();
        });
    });
});