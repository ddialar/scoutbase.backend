import * as dotenv              from 'dotenv';
import * as path                from 'path';
dotenv.config({ path: path.join(process.env.PWD, '/config/.env/test.env') });

import movies                   from '@database/data/movies';
import { graphql }              from 'graphql';
import { importSchema }         from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import resolvers                from '@graphql/resolvers';

describe('Testing GraphQL Movie resolvers ...', () => {
    describe('working with \'movies\' query ...', () => {
        xdescribe('using the resolver ...', () => {
            let parentValues = {};
            let context = {};
            let astData = {};

            test('with no movie IDs provided, it must return all movies.', () => {
                let args = {};
                let expectedResult = movies;
                let obtainedResult = resolvers.Query.movies(parentValues, args, context, astData);

                expect(obtainedResult).toHaveLength(expectedResult.length);
            });
            test('providing a single movie ID, it must return the specific movie.', () => {
                let movieIds = [3];
                let args = { movieIds };
                let expectedResult = movieIds.map(movieId => movies.find(movie => (movie.id === movieId)));
                let obtainedResult = resolvers.Query.movies(parentValues, args, context, astData);

                expect(obtainedResult).not.toBeNull();
                expect(obtainedResult.length).toBe(1);
                expect(obtainedResult[0]).toHaveProperty('id');
                expect(obtainedResult[0].id).toBe(expectedResult[0].id);
                expect(obtainedResult[0]).toHaveProperty('title');
                expect(obtainedResult[0].title).toBe(expectedResult[0].title);
                expect(obtainedResult[0]).toHaveProperty('year');
                expect(obtainedResult[0].year).toBe(expectedResult[0].year);
                expect(obtainedResult[0]).toHaveProperty('rating');
                expect(obtainedResult[0].rating).toBe(expectedResult[0].rating);
            });
            test('providing several movie IDs, it must return the specified movies.', () => {
                let movieIds = [3, 6];
                let args = { movieIds };
                let expectedResult = movieIds.map(movieId => movies.find(movie => (movie.id === movieId)));
                let obtainedResult = resolvers.Query.movies(parentValues, args, context, astData);

                expect(obtainedResult).not.toBeNull();
                expect(obtainedResult.length).toBe(2);
                obtainedResult.map((obtainedMovie, index) => {
                    expect(obtainedMovie).toHaveProperty('id');
                    expect(obtainedMovie.id).toBe(expectedResult[index].id);
                    expect(obtainedMovie).toHaveProperty('title');
                    expect(obtainedMovie.title).toBe(expectedResult[index].title);
                    expect(obtainedMovie).toHaveProperty('year');
                    expect(obtainedMovie.year).toBe(expectedResult[index].year);
                    expect(obtainedMovie).toHaveProperty('rating');
                    expect(obtainedMovie.rating).toBe(expectedResult[index].rating);
                });
            });
        });
        describe('using the GraphQL request ...', () => {
            const schemaPath = path.join(process.env.PWD, '/src/modules/graphql/models/movie/movie.graphql');
            const typeDefs = importSchema(schemaPath);
            const schema = makeExecutableSchema({ typeDefs, resolvers });
            const query = `
                query {
                    movies {
                        title
                        year
                        rating
                    }
                }
            `;
            let parentValues = {};
            let context = {};
            let variables = {};

            test('with no movie IDs provided, it must return all movies.', async (done) => {
                let expectedResult = movies;
                let obtainedResult = await graphql(schema, query, parentValues, context, variables);

                expect(obtainedResult).not.toBeNull();
                expect(obtainedResult).toHaveProperty('data');
                expect(obtainedResult.data).not.toBeNull();
                expect(obtainedResult.data).toHaveProperty('movies');
                expect(obtainedResult.data.movies).not.toBeNull();
                expect(obtainedResult.data.movies).toHaveLength(expectedResult.length);

                obtainedResult.data.movies.map((obtainedMovie, index) => {
                    expect(obtainedMovie).not.toHaveProperty('id');
                    expect(obtainedMovie).toHaveProperty('title');
                    expect(obtainedMovie.title).toBe(expectedResult[index].title);
                    expect(obtainedMovie).toHaveProperty('year');
                    expect(obtainedMovie.year).toBe(expectedResult[index].year);
                    expect(obtainedMovie).toHaveProperty('rating');
                    expect(obtainedMovie.rating).toBe(expectedResult[index].rating);
                });

                done();
            });
        });
    });
});