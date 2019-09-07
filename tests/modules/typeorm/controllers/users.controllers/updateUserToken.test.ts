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
        console.log(`[ERROR] (updateUserToken) - Connecting the database: ${error.message}`);
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
        console.log(`[ERROR] (updateUserToken) - Disconnecting the database: ${error.message}`);
    } finally {
        done();
    }
});

describe('Testing ORM ...', () => {
    describe('working with \'updateUserToken\' ...', () => {
        test('with no userId provided, it must throw an error.', () => {
            let userId = null;
            let newToken: string = 'newUserToken';

            expect(orm.updateUserToken(userId, newToken)).rejects.toThrow('User identification not valid.');
        });
        test('providing a non recorded userId, it must return a NULL value.', async (done) => {
            let userId: number = 99;
            let newToken: string = 'newUserToken';
            let obtainedResult = await orm.updateUserToken(userId, newToken);

            expect(obtainedResult).toBeNull();

            done();
        });
        test('providing a valid userId and new token, the user\'s record must be updated.', async (done) => {
            let userId: number = mockedUserId;
            let newToken: string = 'newUserToken';
            let expectedResult: UserInterface = {
                'id': mockedUserId,
                'name': mockedActorData.name,
                'username': mockedActorData.username,
                'password': mockedActorData.password,
                'token': 'newUserToken'
            };
            let obtainedResult = await orm.updateUserToken(userId, newToken);

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