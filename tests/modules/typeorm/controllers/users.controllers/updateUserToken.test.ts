import users             from '@database/data/users';
import { usersRequests } from '@database/orm';

describe('Testing ORM ...', () => {
    describe('working with \'updateUserToken\' ...', () => {
        test('with no userId provided, it must return a NULL value.', () => {
            let userId = null;
            let newToken = 'newUserToken';
            let obtainedResult = usersRequests.updateUserToken(userId, newToken);

            expect(obtainedResult).toBeNull();
        });
        test('providing a non recorded userId, it must return a NULL value.', () => {
            let userId = 99;
            let newToken = 'newUserToken';
            let obtainedResult = usersRequests.updateUserToken(userId, newToken);

            expect(obtainedResult).toBeNull();
        });
        test('providing a valid user ID and new token, the user\'s record must be updated.', () => {
            let userId = 1;
            let newToken = 'newUserToken';
            let expectedResult = {
                "id": 1,
                "name": "John",
                "surname": "Doe",
                "username": "jdoe",
                "password": "123456",
                "token": "newUserToken"
            };
            let obtainedResult = usersRequests.updateUserToken(userId, newToken);

            expect(obtainedResult).not.toBeNull();
            expect(obtainedResult).toHaveProperty('id');
            expect(obtainedResult.id).toBe(expectedResult.id);
            expect(obtainedResult).toHaveProperty('name');
            expect(obtainedResult.name).toBe(expectedResult.name);
            expect(obtainedResult).toHaveProperty('surname');
            expect(obtainedResult.surname).toBe(expectedResult.surname);
            expect(obtainedResult).toHaveProperty('username');
            expect(obtainedResult.username).toBe(expectedResult.username);
            expect(obtainedResult).toHaveProperty('password');
            expect(obtainedResult.password).toBe(expectedResult.password);
            expect(obtainedResult).toHaveProperty('token');
            expect(obtainedResult.token).toBe(expectedResult.token);
        });
    });
});