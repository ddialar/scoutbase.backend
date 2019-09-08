import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(process.env.PWD, '/config/.env/test.env') });

import resolvers from '@graphql/resolvers';
import schemaDirectives from '@graphql/directives';
import { importSchema } from 'graphql-import';
import { ApolloServerBase } from 'apollo-server-core';
import { createTestClient } from 'apollo-server-testing';

import * as jwt from 'jsonwebtoken';
import orm from '@orm';
import { Users } from '@entities/Users';
import {
    getManager,
    InsertResult
} from 'typeorm';
import {
    NewUserInterface,
    AuthenticatedUserInterface,
    ApiErrorInterface
} from '@interfaces';
import { AuthenticationBadRequestError } from '@apiErrors';

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

describe('Testing GraphQL Authentication resolvers ...', () => {
    describe('working with \'login\' mutation ...', () => {
        describe('testing the raw resolver ...', () => {
            let parentValues = {};
            let context = {};
            let astData = {};

            test('providing an empty string as username, it must return an error.', async (done) => {
                let args = {
                    username: '',
                    password: mockedPassword
                };
                let obtainedResult = await resolvers.Mutation.login(parentValues, args, context, astData);

                expect(obtainedResult instanceof AuthenticationBadRequestError).toBeTruthy();

                done();
            });
            test('providing a null value as username, it must return an error.', async (done) => {
                let args = {
                    username: null,
                    password: mockedPassword
                };
                let obtainedResult = await resolvers.Mutation.login(parentValues, args, context, astData);

                expect(obtainedResult instanceof AuthenticationBadRequestError).toBeTruthy();

                done();
            });
            test('providing an empty string as password, it must return an error.', async (done) => {
                let args = {
                    username: mockedUserData.username,
                    password: ''
                };
                let obtainedResult = await resolvers.Mutation.login(parentValues, args, context, astData);

                expect(obtainedResult instanceof AuthenticationBadRequestError).toBeTruthy();

                done();
            });
            test('providing a valid username and password, the user\'s record must be updated with a new token and returns an user authenticated object.', async (done) => {
                let args = {
                    username: mockedUserData.username,
                    password: mockedPassword
                };
                let expectedResult = {
                    'token': 'onlyTokenStructureAnalyzed',
                    'user': {
                        'id': mockedUserId,
                        'name': mockedUserData.name
                    }
                };
                let obtainedResult = await resolvers.Mutation.login(parentValues, args, context, astData);

                expect(obtainedResult).not.toBeNull();
                expect(obtainedResult).toHaveProperty('token');
                expect(async () => await jwt.verify(obtainedResult.token, process.env.JWT_KEY)).not.toThrow();
                expect(obtainedResult).toHaveProperty('user');
                expect(obtainedResult.user).not.toBeNull();
                expect(obtainedResult.user).toHaveProperty('id');
                expect(obtainedResult.user.id).toBe(expectedResult.user.id);
                expect(obtainedResult.user).toHaveProperty('name');
                expect(obtainedResult.user.name).toBe(expectedResult.user.name);

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
            const LOGIN = `
                mutation($username: String!, $password: String!) {
                    login (
                        username: $username,
                        password: $password 
                    ) {
                        __typename
                        ... on AuthenticatedUser {
                            token
                            user {
                                id
                                name
                            }
                        }
                        ... on ApiError {
                            apiErrorCode
                            message
                            description
                        }
                    }
                }
            `;

            test('providing a non valid username, it must return an error.', async (done) => {
                let variables = {
                    username: 'nonExistingUsername',
                    password: mockedPassword
                };

                let expectedResult: ApiErrorInterface = {
                    'apiErrorCode': 400,
                    'message': 'Authentication bad request.',
                    'description': ''
                };
                let obtainedResult = await testingClient.mutate({ mutation: LOGIN, variables });

                expect(obtainedResult).not.toBeNull();
                expect(obtainedResult).not.toBeNull();
                expect(obtainedResult).toHaveProperty('data');
                expect(obtainedResult.data).not.toBeNull();
                expect(obtainedResult.data).toHaveProperty('login');
                expect(obtainedResult.data.login).not.toBeNull();
                expect(obtainedResult.data.login).toHaveProperty('__typename');
                expect(obtainedResult.data.login.__typename).toBe('ApiError');
                expect(obtainedResult.data.login).toHaveProperty('apiErrorCode');
                expect(obtainedResult.data.login.apiErrorCode).toBe(expectedResult.apiErrorCode);
                expect(obtainedResult.data.login).toHaveProperty('message');
                expect(obtainedResult.data.login.message).toBe(expectedResult.message);
                expect(obtainedResult.data.login).toHaveProperty('description');
                expect(obtainedResult.data.login.description).toBe(expectedResult.description);

                done();
            });
            test('providing a non valid password, it must return an error.', async (done) => {
                let variables = {
                    username: mockedUserData.username,
                    password: '161803'
                };

                let expectedResult: ApiErrorInterface = {
                    'apiErrorCode': 400,
                    'message': 'Authentication bad request.',
                    'description': ''
                };
                let obtainedResult = await testingClient.mutate({ mutation: LOGIN, variables });

                expect(obtainedResult).not.toBeNull();
                expect(obtainedResult).not.toBeNull();
                expect(obtainedResult).toHaveProperty('data');
                expect(obtainedResult.data).not.toBeNull();
                expect(obtainedResult.data).toHaveProperty('login');
                expect(obtainedResult.data.login).not.toBeNull();
                expect(obtainedResult.data.login).toHaveProperty('__typename');
                expect(obtainedResult.data.login.__typename).toBe('ApiError');
                expect(obtainedResult.data.login).toHaveProperty('apiErrorCode');
                expect(obtainedResult.data.login.apiErrorCode).toBe(expectedResult.apiErrorCode);
                expect(obtainedResult.data.login).toHaveProperty('message');
                expect(obtainedResult.data.login.message).toBe(expectedResult.message);
                expect(obtainedResult.data.login).toHaveProperty('description');
                expect(obtainedResult.data.login.description).toBe(expectedResult.description);

                done();
            });
            test('providing a valid username and password, the user\'s record must be updated with a new token and returns an user authenticated object.', async (done) => {
                let variables = {
                    username: mockedUserData.username,
                    password: mockedPassword
                };

                let expectedResult: AuthenticatedUserInterface = {
                    'token': 'onlyTokenStructureAnalyzed',
                    'user': {
                        'id': mockedUserId,
                        'name': 'TestActor'
                    }
                };
                let obtainedResult = await testingClient.mutate({ mutation: LOGIN, variables });

                expect(obtainedResult).not.toBeNull();
                expect(obtainedResult).toHaveProperty('data');
                expect(obtainedResult.data).not.toBeNull();
                expect(obtainedResult.data).toHaveProperty('login');
                expect(obtainedResult.data.login).not.toBeNull();
                expect(obtainedResult.data.login).toHaveProperty('__typename');
                expect(obtainedResult.data.login.__typename).toBe('AuthenticatedUser');
                expect(obtainedResult.data.login).toHaveProperty('token');
                expect(async () => await jwt.verify(obtainedResult.data.login.token, process.env.JWT_KEY)).not.toThrow();
                expect(obtainedResult.data.login).toHaveProperty('user');
                expect(obtainedResult.data.login.user).not.toBeNull();
                expect(obtainedResult.data.login.user).toHaveProperty('id');
                expect(obtainedResult.data.login.user.id).toBe(expectedResult.user.id);
                expect(obtainedResult.data.login.user).toHaveProperty('name');
                expect(obtainedResult.data.login.user.name).toBe(expectedResult.user.name);

                done();
            });
        });
    });
});