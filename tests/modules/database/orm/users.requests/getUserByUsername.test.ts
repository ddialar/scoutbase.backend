import users             from '@database/data/users';
import { usersRequests } from '@database/orm';

describe('Testing ORM ...', () => {
    describe('working with \'getUserByUsername\' ...', () => {
        test('with no username provided, it must return a NULL value.', () => {
            let username = '';
            let obtainedResult = usersRequests.getUserByUsername(username);

            expect(obtainedResult).toBeNull();
        });
        test('providing a non recorded username, it must return a NULL value.', () => {
            let username = 'nonpersistedusername';
            let obtainedResult = usersRequests.getUserByUsername(username);

            expect(obtainedResult).toBeNull();
        });
        test('providing a movie ID, it must return all actors bound with this movie.', () => {
            let username = 'jdoe';
            let expectedResult = {
                "id": 1,
                "name": "John",
                "surname": "Doe",
                "username": "jdoe",
                "password": "123456",
                "token": ""
            };
            let obtainedResult = usersRequests.getUserByUsername(username);

            expect(obtainedResult).not.toBeNull();
            expect(obtainedResult).toHaveProperty('id');
            expect(obtainedResult.id).toBe(expectedResult.id);
            expect(obtainedResult).toHaveProperty('name');
            expect(obtainedResult.name).toBe(expectedResult.name);
            expect(obtainedResult).toHaveProperty('surname');
            expect(obtainedResult.surname).toBe(expectedResult.surname);
            expect(obtainedResult).toHaveProperty('username');
            expect(obtainedResult.username).toBe(expectedResult.username);
            expect(obtainedResult).toHaveProperty('username');
            expect(obtainedResult.username).toBe(expectedResult.username);
            expect(obtainedResult).toHaveProperty('password');
            expect(obtainedResult.password).toBe(expectedResult.password);
            expect(obtainedResult).toHaveProperty('token');
            expect(obtainedResult.token).toBe(expectedResult.token);
        });
    });
});