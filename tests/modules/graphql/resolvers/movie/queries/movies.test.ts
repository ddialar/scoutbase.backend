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
        describe('using the resolver ...', () => {
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
            let parentValues = {};
            let context = {};
            let variables = {};
            describe('requesting only the movie\'s data ...', () => {
                const query = `
                    query {
                        movies {
                            title
                            year
                            rating
                        }
                    }
                `;
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
            })
            describe('requesting only the movie\'s data and its actors ...', () => {
                const query = `
                    query {
                        movies {
                            title
                            year
                            rating
                            actors {
                                name
                                birthday
                                country
                            }
                        }
                    }
                `;
                test('with no movie IDs provided, it must return all movies.', async (done) => {
                    let expectedResult = [
                        {
                            "title": "The Imitation Game",
                            "year": 2014,
                            "rating": 5,
                            "actors": [
                                {
                                    "name": "Benedict Cumberbatch",
                                    "birthday": "1976-06-19",
                                    "country": "United Kingdom"
                                },
                                {
                                    "name": "Keira Knightley",
                                    "birthday": "1985-03-26",
                                    "country": "United Kingdom"
                                },
                                {
                                    "name": "Matthew Goode",
                                    "birthday": "1978-04-03",
                                    "country": "United Kingdom"
                                },
                                {
                                    "name": "Rory Kinnear",
                                    "birthday": "1976-02-17",
                                    "country": "United Kingdom"
                                },
                                {
                                    "name": "Allen Leech",
                                    "birthday": "1981-05-18",
                                    "country": "Ireland"
                                }
                            ]
                        },
                        {
                            "title": "Doctor Strange",
                            "year": 1982,
                            "rating": 7.6,
                            "actors": [
                                {
                                    "name": "Benedict Cumberbatch",
                                    "birthday": "1976-06-19",
                                    "country": "United Kingdom"
                                },
                                {
                                    "name": "Chiwetel Ejiofor",
                                    "birthday": "1977-07-10",
                                    "country": "United Kingdom"
                                },
                                {
                                    "name": "Rachel McAdams",
                                    "birthday": "1978-11-17",
                                    "country": "Canada"
                                },
                                {
                                    "name": "Benedict Wong",
                                    "birthday": "1971-06-03",
                                    "country": "United Kingdom"
                                },
                                {
                                    "name": "Tilda Swinton",
                                    "birthday": "1960-11-05",
                                    "country": "United Kingdom"
                                }
                            ]
                        },
                        {
                            "title": "Blade Runner",
                            "year": 1982,
                            "rating": 8.3,
                            "actors": [
                                {
                                    "name": "Harrison Ford",
                                    "birthday": "1942-06-13",
                                    "country": "USA"
                                },
                                {
                                    "name": "Rutger Hauer",
                                    "birthday": "1944-01-23",
                                    "country": "Netherland"
                                },
                                {
                                    "name": "Sean Young",
                                    "birthday": "1959-11-20",
                                    "country": "USA"
                                },
                                {
                                    "name": "Edward James Olmos",
                                    "birthday": "1947-02-24",
                                    "country": "USA"
                                },
                                {
                                    "name": "Daryl Hannah",
                                    "birthday": "1960-12-03",
                                    "country": "USA"
                                }
                            ]
                        },
                        {
                            "title": "The Dark Knight",
                            "year": 2008,
                            "rating": 4.5,
                            "actors": [
                                {
                                    "name": "Christian Bale",
                                    "birthday": "1974-01-30",
                                    "country": "United Kingdom"
                                },
                                {
                                    "name": "Michael Caine",
                                    "birthday": "1933-03-14",
                                    "country": "United Kingdom"
                                },
                                {
                                    "name": "Aaron Eckhart",
                                    "birthday": "1968-03-12",
                                    "country": "USA"
                                },
                                {
                                    "name": "Morgan Freeman",
                                    "birthday": "1937-06-01",
                                    "country": "USA"
                                },
                                {
                                    "name": "Heath Ledger",
                                    "birthday": "1978-04-04",
                                    "country": "Australia"
                                }
                            ]
                        },
                        {
                            "title": "Inception",
                            "year": 2010,
                            "rating": 4,
                            "actors": [
                                {
                                    "name": "Leonardo DiCaprio",
                                    "birthday": "1974-11-11",
                                    "country": "USA"
                                },
                                {
                                    "name": "Joseph Gordon-Levitt",
                                    "birthday": "1981-02-17",
                                    "country": "USA"
                                },
                                {
                                    "name": "Ellen Page",
                                    "birthday": "1987-02-21",
                                    "country": "Canada"
                                },
                                {
                                    "name": "Tom Hardy",
                                    "birthday": "1977-09-15",
                                    "country": "United Kingdom"
                                },
                                {
                                    "name": "Marion Cotillard",
                                    "birthday": "1975-09-30",
                                    "country": "France"
                                }
                            ]
                        },
                        {
                            "title": "The Matrix",
                            "year": 1999,
                            "rating": 4,
                            "actors": [
                                {
                                    "name": "Keanu Reeves",
                                    "birthday": "1964-09-02",
                                    "country": "Lebanon"
                                },
                                {
                                    "name": "Laurence Fishburne",
                                    "birthday": "1961-07-30",
                                    "country": "USA"
                                },
                                {
                                    "name": "Carrie-Anne Moss",
                                    "birthday": "1967-08-21",
                                    "country": "Canada"
                                },
                                {
                                    "name": "Hugo Weaving",
                                    "birthday": "1960-04-04",
                                    "country": "Nigeria"
                                }
                            ]
                        }
                    ];
                    let obtainedResult = await graphql(schema, query, parentValues, context, variables);

                    expect(obtainedResult).not.toBeNull();
                    expect(obtainedResult).toHaveProperty('data');
                    expect(obtainedResult.data).not.toBeNull();
                    expect(obtainedResult.data).toHaveProperty('movies');
                    expect(obtainedResult.data.movies).not.toBeNull();
                    expect(obtainedResult.data.movies).toHaveLength(expectedResult.length);

                    obtainedResult.data.movies.map((obtainedMovie, movieIndex) => {
                        expect(obtainedMovie).not.toHaveProperty('id');
                        expect(obtainedMovie).toHaveProperty('title');
                        expect(obtainedMovie.title).toBe(expectedResult[movieIndex].title);
                        expect(obtainedMovie).toHaveProperty('year');
                        expect(obtainedMovie.year).toBe(expectedResult[movieIndex].year);
                        expect(obtainedMovie).toHaveProperty('rating');
                        expect(obtainedMovie.rating).toBe(expectedResult[movieIndex].rating);
                        expect(obtainedMovie).toHaveProperty('actors');
                        expect(obtainedMovie.actors).toHaveLength(expectedResult[movieIndex].actors.length);

                        obtainedMovie.actors.map((actor, actorIndex) => {
                            expect(actor).not.toHaveProperty('id');
                            expect(actor).toHaveProperty('name');
                            expect(actor.name).toBe(expectedResult[movieIndex].actors[actorIndex].name);
                            expect(actor).toHaveProperty('birthday');
                            expect(actor.birthday).toBe(expectedResult[movieIndex].actors[actorIndex].birthday);
                            expect(actor).toHaveProperty('country');
                            expect(actor.country).toBe(expectedResult[movieIndex].actors[actorIndex].country);
                        });
                    });

                    done();
                });
            })
        });
    });
});