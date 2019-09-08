import * as dotenv from 'dotenv';
import * as path   from 'path';
dotenv.config({ path: path.join(process.env.PWD, '/config/.env/test.env') });

import * as jwt                          from 'jsonwebtoken';
import orm                               from '@orm';
import { Users }                         from '@entities/Users';
import { login }                         from '@ports';
import { AuthenticationBadRequestError } from '@apiErrors'
import { NewUserInterface } from '@interfaces';
import { 
    getManager,
    InsertResult
} from 'typeorm';

const mockedPassword: string = '123456';
const mockedUserData: NewUserInterface = {
    name: 'TestActor',
    username: 'tactor',
    password: '$2a$04$ClyWJzl7mPUtaOgv.fvOhu9t5sqnCFeoH1KRab5omyvKAd3lRZt.y'
};
let mockedUserId: number;

beforeAll(async (done) => {
    try {
        await orm.connect();
        mockedUserId = await getManager()
            .getRepository(Users)
            .insert(mockedUserData)
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

describe('Testing Authentication ports ...', () => {
    describe('working with \'login\' ...', () => {
        test('providing an empty string as username, it must return an error.', async () => {
            let username = '';
            let password = '$2a$04$ClyWJzl7mPUtaOgv.fvOhu9t5sqnCFeoH1KRab5omyvKAd3lRZt.y';
            let obtainedResult = await login(username, password);

            expect(obtainedResult instanceof AuthenticationBadRequestError).toBeTruthy();
        });
        test('providing a null value as username, it must return an error.', async () => {
            let username = null;
            let password = '$2a$04$ClyWJzl7mPUtaOgv.fvOhu9t5sqnCFeoH1KRab5omyvKAd3lRZt.y';
            let obtainedResult = await login(username, password);

            expect(obtainedResult instanceof AuthenticationBadRequestError).toBeTruthy();
        });
        test('providing an empty string as password, it must return an error.', async () => {
            let username = 'jdoe';
            let password = '';
            let obtainedResult = await login(username, password);

            expect(obtainedResult instanceof AuthenticationBadRequestError).toBeTruthy();
        });
        test('providing a valid username and password, the user\'s record must be updated with a new token and returns an user authenticated object.', async (done) => {
            let username = mockedUserData.username;
            let password = mockedPassword;
            let expectedResult = {
                "token": "onlyTokenStructureAnalyzed",
                "user": {
                    "id": mockedUserId,
                    "name": mockedUserData.name
                }
            };
            let obtainedResult = await login(username, password);

            expect(obtainedResult).not.toBeNull();
            expect(obtainedResult).toHaveProperty('token');
            expect(async () => await jwt.verify(obtainedResult.token, process.env.JWT_KEY)).not.toThrow();
            expect(obtainedResult).toHaveProperty('user');
            expect(obtainedResult.user).not.toBeNull();
            expect(obtainedResult.user).toHaveProperty('id');
            expect(obtainedResult.user.id).toBe(expectedResult.user.id);
            expect(obtainedResult.user).toHaveProperty('name');
            expect(obtainedResult.user.name).toBe(expectedResult.user.name);

            done()
        });
    });
});