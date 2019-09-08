import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(process.env.PWD, '/config/.env/test.env') });

import resolvers from '@graphql/resolvers';
import schemaDirectives from '@graphql/directives';
import { importSchema } from 'graphql-import';
import { ApolloServerBase } from 'apollo-server-core';
import { createTestClient } from 'apollo-server-testing';

import orm from '@orm';
import { Users } from '@entities/Users';
import {
    getManager,
    InsertResult
} from 'typeorm';
import {
    NewUserInterface,
    ApiErrorInterface
} from '@interfaces';
import { 
    NewUserAlreadyExistsError,
    CreateNewUserBadRequestError
} from '@apiErrors';

const mockedPassword: string = '123456';
const mockedUserData: NewUserInterface = {
    name: 'TestActor',
    username: 'tactor',
    password: '$2a$04$ClyWJzl7mPUtaOgv.fvOhu9t5sqnCFeoH1KRab5omyvKAd3lRZt.y'
};
let mockedUserId: number;

const deleteUser = async (userId: number) => {
    await getManager()
        .getRepository(Users)
        .delete(userId);
};

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
        await deleteUser(mockedUserId);
        await orm.disconnect();
    } catch (error) {
        console.log(`[ERROR] (getUserByUsername) - Disconnecting the database: ${error.message}`);
    } finally {
        done();
    }
});

describe('Testing GraphQL User resolvers ...', () => {
    describe('working with \'createUser\' mutation ...', () => {
        describe('testing the raw resolver ...', () => {
            let parentValues = {};
            let context = {};
            let astData = {};

            test('trying to create an a user with a wrong data structure, it must return an error.', async (done) => {
                let args = {
                    'name': mockedUserData.name,
                    'username': mockedUserData.username,
                    'password': mockedPassword
                };
                let obtainedResult = await resolvers.Mutation.createUser(parentValues, args, context, astData);

                expect(obtainedResult instanceof CreateNewUserBadRequestError).toBeTruthy();

                done();
            });
            test('trying to create an already persisted user, it must return an error.', async (done) => {
                let args = {
                    'data': {
                        'name': mockedUserData.name,
                        'username': mockedUserData.username,
                        'password': mockedPassword
                    }
                };
                let obtainedResult = await resolvers.Mutation.createUser(parentValues, args, context, astData);

                expect(obtainedResult instanceof NewUserAlreadyExistsError).toBeTruthy();

                done();
            });
            test('providing valid user data, it must be created successfully.', async (done) => {
                let args = {
                    'data': {
                        'name': 'Mike',
                        'username': 'mwazowski',
                        'password': mockedPassword
                    }
                };
                let expectedResult = {
                    'name': 'Mike',
                    'username': 'mwazowski',
                    'password': mockedPassword
                };
                let obtainedResult = await resolvers.Mutation.createUser(parentValues, args, context, astData);

                expect(obtainedResult).not.toBeNull();
                expect(obtainedResult).toHaveProperty('id');
                expect(obtainedResult.id).toBeGreaterThan(0);
                expect(obtainedResult).toHaveProperty('name');
                expect(obtainedResult.name).toBe(expectedResult.name);
                expect(obtainedResult).toHaveProperty('username');
                expect(obtainedResult.username).toBe(expectedResult.username);
                expect(obtainedResult).toHaveProperty('password');
                expect(obtainedResult.password).not.toBeNull();
                expect(obtainedResult.password).not.toBe(expectedResult.password);
                expect(obtainedResult).toHaveProperty('token');
                expect(obtainedResult.token).toBe('');

                await deleteUser(obtainedResult.id);

                done();
            });
        });
        describe('using the GraphQL request ...', () => {
            const schemaPath = path.join(process.env.PWD, '/src/modules/graphql/schema.graphql');
            const typeDefs = importSchema(schemaPath);
            const server = new ApolloServerBase({
                typeDefs,
                resolvers,
                schemaDirectives,
                context: {}
            });
            const testingClient = createTestClient(server);
            const CREATE_USER = `
                mutation ($data: UserInput!) {
                    createUser(data: $data) {
                        __typename
                        ... on User {
                            id
                            name
                        }
                        ... on ApiError {
                            apiErrorCode
                            message
                            description
                        }
                    }
                }
            `;

            test('trying to create an already persisted user, it must return an error.', async (done) => {
                let variables = {
                    'data': {
                        'name': mockedUserData.name,
                        'username': mockedUserData.username,
                        'password': mockedPassword
                    }
                };

                let expectedResult: ApiErrorInterface = {
                    'apiErrorCode': 409,
                    'message': 'Creating user conflict.',
                    'description': ''
                };
                let obtainedResult = await testingClient.mutate({ mutation: CREATE_USER, variables });

                expect(obtainedResult).not.toBeNull();
                expect(obtainedResult).toHaveProperty('data');
                expect(obtainedResult.data).not.toBeNull();
                expect(obtainedResult.data).toHaveProperty('createUser');
                expect(obtainedResult.data.createUser).not.toBeNull();
                expect(obtainedResult.data.createUser).toHaveProperty('__typename');
                expect(obtainedResult.data.createUser.__typename).toBe('ApiError');
                expect(obtainedResult.data.createUser).toHaveProperty('apiErrorCode');
                expect(obtainedResult.data.createUser.apiErrorCode).toBe(expectedResult.apiErrorCode);
                expect(obtainedResult.data.createUser).toHaveProperty('message');
                expect(obtainedResult.data.createUser.message).toBe(expectedResult.message);
                expect(obtainedResult.data.createUser).toHaveProperty('description');
                expect(obtainedResult.data.createUser.description).toBe(expectedResult.description);

                done();
            });
            test('providing a non valid password, it must return an error.', async (done) => {
                let variables = {
                    'data': {
                        'name': 'Mike',
                        'username': 'mwazowski',
                        'password': mockedPassword
                    }
                };
                let expectedResult = {
                    '__typename': 'User',
                    'name': 'Mike',
                    'username': 'mwazowski',
                };
                let obtainedResult = await testingClient.mutate({ mutation: CREATE_USER, variables });

                expect(obtainedResult).not.toBeNull();
                expect(obtainedResult).toHaveProperty('data');
                expect(obtainedResult.data).not.toBeNull();
                expect(obtainedResult.data).toHaveProperty('createUser');
                expect(obtainedResult.data.createUser).not.toBeNull();
                expect(obtainedResult.data.createUser).toHaveProperty('__typename');
                expect(obtainedResult.data.createUser.__typename).toBe(expectedResult.__typename);
                expect(obtainedResult.data.createUser).toHaveProperty('id');
                expect(obtainedResult.data.createUser.id).toBeGreaterThan(0);
                expect(obtainedResult.data.createUser).toHaveProperty('name');
                expect(obtainedResult.data.createUser.name).toBe(expectedResult.name);

                await deleteUser(obtainedResult.data.createUser.id);

                done();
            });
        });
    });
});