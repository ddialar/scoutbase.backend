import * as dotenv from 'dotenv';
import * as path   from 'path';
dotenv.config({ path: path.join(process.env.PWD, '/config/.env/test.env') });

import * as jwt    from 'jwt-simple';
import { login }   from '@ports';

describe('Testing Authentication ports ...', () => {
    describe('working with \'login\' ...', () => {
        test('providing an empty string as username, it must throw an error.', async () => {
            let username = '';
            let password = '$2a$04$ClyWJzl7mPUtaOgv.fvOhu9t5sqnCFeoH1KRab5omyvKAd3lRZt.y';

            try {
                await login(username, password);
            } catch (error) {
                expect(error.message).toMatch('Authenticating user. User not found.');
            }
        });
        test('providing a null value as username, it must throw an error.', async () => {
            let username = null;
            let password = '$2a$04$ClyWJzl7mPUtaOgv.fvOhu9t5sqnCFeoH1KRab5omyvKAd3lRZt.y';

            try {
                await login(username, password);
            } catch (error) {
                expect(error.message).toMatch('Authenticating user. User not found.');
            }
        });
        test('providing an empty string as password, it must throw an error.', async () => {
            let username = 'jdoe';
            let password = '';

            try {
                await login(username, password);
            } catch (error) {
                expect(error.message).toMatch('Authenticating user. Password \'\' doesn\'t match.');
            }
        });
        test('providing a valid username and password, the user\'s record must be updated with a new token and returns an user authenticated object.', async (done) => {
            let username = 'jdoe';
            let password = '123456';
            let expectedResult = {
                "token": "onlyTokenStructureAnalyzed",
                "user": {
                    "id": 1,
                    "name": "John"
                }
            };
            let obtainedResult = await login(username, password);

            expect(obtainedResult).not.toBeNull();
            expect(obtainedResult).toHaveProperty('token');
            expect(async () => await jwt.decode(obtainedResult.token, process.env.JWT_KEY)).not.toThrow();
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