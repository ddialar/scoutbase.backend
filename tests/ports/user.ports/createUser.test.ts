import * as dotenv from 'dotenv';
import * as path   from 'path';
dotenv.config({ path: path.join(process.env.PWD, '/config/.env/test.env') });

import orm                  from '@orm';
import { Users }            from '@entities/Users';
import { createUser }       from '@ports';
import { NewUserInterface } from '@interfaces';
import { getManager }       from 'typeorm';

const mockedUserData: NewUserInterface = {
    name: 'TestActor',
    username: 'tactor',
    password: '$2a$04$ClyWJzl7mPUtaOgv.fvOhu9t5sqnCFeoH1KRab5omyvKAd3lRZt.y'
};

const removeUser = async (userId) => {
    await getManager()
        .getRepository(Users)
        .delete(userId);
};

beforeAll(async (done) => {
    try {
        await orm.connect();
    } catch (error) {
        console.log(`[ERROR] (createUser) - Connecting the database: ${error.message}`);
    } finally {
        done();
    }
});

afterAll(async (done) => {
    try {
        await orm.disconnect();
    } catch (error) {
        console.log(`[ERROR] (createUser) - Disconnecting the database: ${error.message}`);
    } finally {
        done();
    }
});

describe('Testing User ports ...', () => {
    describe('working with \'createUser\' ...', () => {
        test('providing a movie ID, it must return all actors bound with this movie.', async (done) => {
            let newUserData: NewUserInterface = mockedUserData;
            let expectedResult = {
                name: 'TestActor',
                username: 'tactor',
                token: ''
            };
            let createdResult = await createUser(newUserData);

            expect(createdResult).not.toBeNull();
            expect(createdResult).toHaveProperty('id');
            expect(createdResult.id).not.toBeNull();
            expect(createdResult).toHaveProperty('name');
            expect(createdResult.name).toBe(expectedResult.name);
            expect(createdResult).toHaveProperty('username');
            expect(createdResult.username).toBe(expectedResult.username);
            expect(createdResult).toHaveProperty('password');
            expect(createdResult.password).not.toBeNull();
            expect(createdResult.password).not.toBe('');
            expect(createdResult).toHaveProperty('token');
            expect(createdResult.token).toBe(expectedResult.token);

            await removeUser(createdResult.id);

            done();
        });
    });
});