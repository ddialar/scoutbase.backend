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
import { MovieInterface } from '@interfaces';

interface GqlPersonInterface {
    name: string;
    birthday: string;
    country: string;
};
interface GqlActorInterface extends GqlPersonInterface {
    directors?: GqlPersonInterface[];
};
interface GqlMovieInterface {
    scoutbase_rating?: string
    title: string;
    year?: number;
    rating?: number;
    actors?: GqlActorInterface[];
    directors?: GqlPersonInterface[];
};
interface JwtPayloadInterface {
    sub: string
};
interface JwtOptionsInterface {
    algorithm: string
    expiresIn: number
};

const outOfDateToken = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqZG9lIiwiaWF0IjoxNTY3OTQwNzg2LCJleHAiOjE1Njc5NDA3OTZ9.jcIVMXo9-GZaWqNfkqY1NKlnyCwujiVDBOpENPwOtMxJXkQuEC74VdTJZmqYdN_32kgz2eKmsnFzcUPlA6eL-w';
const generateUpToDateToken = (expiresIn) => {
    let payload: JwtPayloadInterface = {
        sub: 'testinUser'
    }
    let secret: string = process.env.JWT_KEY!;
    let options: JwtOptionsInterface = {
        algorithm: process.env.JWT_ALGORITHM || 'HS512',
        expiresIn
    };
    
    return jwt.sign(payload, secret, options);
};

beforeAll(async (done) => {
    try {
        await orm.connect();
    } catch (error) {
        console.log(`[ERROR] (GraphQL - movies) - Connecting the database: ${error.message}`);
    } finally {
        done();
    }
});

afterAll(async (done) => {
    try {
        await orm.disconnect();
    } catch (error) {
        console.log(`[ERROR] (GraphQL - movies) - Disconnecting the database: ${error.message}`);
    } finally {
        done();
    }
});

describe('Testing GraphQL Movie resolvers ...', () => {
    describe('working with \'movies\' query ...', () => {
        describe('testing the raw resolver ...', () => {
            let parentValues = {};
            let args = {};
            let context = {};
            let astData = {};
            const mockedMoviesData: MovieInterface[] = [
                {
                    "id": 1,
                    "title": "The Imitation Game",
                    "year": 2014,
                    "rating": 5
                },
                {
                    "id": 2,
                    "title": "Doctor Strange",
                    "year": 1982,
                    "rating": 7.6
                },
                {
                    "id": 3,
                    "title": "Blade Runner",
                    "year": 1982,
                    "rating": 8.3
                },
                {
                    "id": 4,
                    "title": "The Dark Knight",
                    "year": 2008,
                    "rating": 4.5
                },
                {
                    "id": 5,
                    "title": "Inception",
                    "year": 2010,
                    "rating": 4
                },
                {
                    "id": 6,
                    "title": "The Matrix",
                    "year": 1999,
                    "rating": 4
                }
            ];

            test('providing a single movie ID, it must return the specific movie.', async (done) => {
                let expectedResult = mockedMoviesData;
                let obtainedResult = await resolvers.Query.movies(parentValues, args, context, astData);

                expect(obtainedResult).not.toBeNull();
                expect(obtainedResult).toHaveLength(expectedResult.length);
                obtainedResult.map((movie, index) => {
                    expect(movie).toHaveProperty('id');
                    expect(movie.id).toBe(expectedResult[index].id);
                    expect(movie).toHaveProperty('title');
                    expect(movie.title).toBe(expectedResult[index].title);
                    expect(movie).toHaveProperty('year');
                    expect(movie.year).toBe(expectedResult[index].year);
                    expect(movie).toHaveProperty('rating');
                    expect(movie.rating).toBe(expectedResult[index].rating);
                });

                done();
            });
        });
        describe('using the GraphQL request ...', () => {
            const schemaPath = path.join(process.env.PWD, '/src/modules/graphql/schema.graphql');
            const typeDefs = importSchema(schemaPath);
            let variables = {};

            describe('running single queries ...', () => {
                const server = new ApolloServerBase({
                    typeDefs,
                    resolvers,
                    schemaDirectives,
                    context: {}
                });
                const testingClient = createTestClient(server);

                test('it must return all movies data.', async (done) => {
                    const MOVIES = `
                        query {
                            movies {
                                title
                                year
                                rating
                            }
                        }
                    `;
                    let expectedResult: GqlMovieInterface[] = [
                        {
                            "title": "The Imitation Game",
                            "year": 2014,
                            "rating": 5
                        },
                        {
                            "title": "Doctor Strange",
                            "year": 1982,
                            "rating": 7.6
                        },
                        {
                            "title": "Blade Runner",
                            "year": 1982,
                            "rating": 8.3
                        },
                        {
                            "title": "The Dark Knight",
                            "year": 2008,
                            "rating": 4.5
                        },
                        {
                            "title": "Inception",
                            "year": 2010,
                            "rating": 4
                        },
                        {
                            "title": "The Matrix",
                            "year": 1999,
                            "rating": 4
                        }
                    ];
                    let obtainedResult = await testingClient.query({ query: MOVIES, variables });

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
                test('it must return all movies and their actors data.', async (done) => {
                    const MOVIES = `
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
                    let expectedResult: GqlMovieInterface[] = [
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
                    let obtainedResult = await testingClient.query({ query: MOVIES, variables });

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
                test('it must return all movies and their directors data.', async (done) => {
                    const MOVIES = `
                            query {
                                movies {
                                    title
                                    year
                                    rating
                                    directors {
                                        name
                                        birthday
                                        country
                                    }
                                }
                            }
                        `;
                    let expectedResult: GqlMovieInterface[] = [
                        {
                            "title": "The Imitation Game",
                            "year": 2014,
                            "rating": 5,
                            "directors": [
                                {
                                    "name": "Morten Tyldum",
                                    "birthday": "1967-05-19",
                                    "country": "Norway"
                                }
                            ]
                        },
                        {
                            "title": "Doctor Strange",
                            "year": 1982,
                            "rating": 7.6,
                            "directors": [
                                {
                                    "name": "Scott Derrickson",
                                    "birthday": "1966-03-18",
                                    "country": "United States"
                                }
                            ]
                        },
                        {
                            "title": "Blade Runner",
                            "year": 1982,
                            "rating": 8.3,
                            "directors": [
                                {
                                    "name": "Ridley Scott",
                                    "birthday": "1937-11-30",
                                    "country": "United Kingdom"
                                }
                            ]
                        },
                        {
                            "title": "The Dark Knight",
                            "year": 2008,
                            "rating": 4.5,
                            "directors": [
                                {
                                    "name": "Christopher Nolan",
                                    "birthday": "1970-06-30",
                                    "country": "United Kingdom"
                                }
                            ]
                        },
                        {
                            "title": "Inception",
                            "year": 2010,
                            "rating": 4,
                            "directors": [
                                {
                                    "name": "Christopher Nolan",
                                    "birthday": "1970-06-30",
                                    "country": "United Kingdom"
                                }
                            ]
                        },
                        {
                            "title": "The Matrix",
                            "year": 1999,
                            "rating": 4,
                            "directors": [
                                {
                                    "name": "Lana Wachowski",
                                    "birthday": "1965-06-21",
                                    "country": "United States"
                                },
                                {
                                    "name": "Lilly Wachowski",
                                    "birthday": "1967-12-29",
                                    "country": "United States"
                                }
                            ]
                        }
                    ];
                    let obtainedResult = await testingClient.query({ query: MOVIES, variables });

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
                        expect(obtainedMovie).toHaveProperty('directors');
                        expect(obtainedMovie.directors).toHaveLength(expectedResult[movieIndex].directors.length);

                        obtainedMovie.directors.map((director, directorIndex) => {
                            expect(director).not.toHaveProperty('id');
                            expect(director).toHaveProperty('name');
                            expect(director.name).toBe(expectedResult[movieIndex].directors[directorIndex].name);
                            expect(director).toHaveProperty('birthday');
                            expect(director.birthday).toBe(expectedResult[movieIndex].directors[directorIndex].birthday);
                            expect(director).toHaveProperty('country');
                            expect(director.country).toBe(expectedResult[movieIndex].directors[directorIndex].country);
                        });
                    });

                    done();
                });
                test('it must return all movies with their actors and directors.', async (done) => {
                    const MOVIES = `
                        query {
                            movies {
                                title
                                year
                                rating
                                actors {
                                    name
                                    birthday
                                    country
                                    directors {
                                        name
                                        birthday
                                        country
                                    }
                                }
                            }
                        }
                    `;
                    let expectedResult: GqlMovieInterface[] = [
                        {
                            "title": "The Imitation Game",
                            "year": 2014,
                            "rating": 5,
                            "actors": [
                                {
                                    "name": "Benedict Cumberbatch",
                                    "birthday": "1976-06-19",
                                    "country": "United Kingdom",
                                    "directors": [
                                        {
                                            "name": "Morten Tyldum",
                                            "birthday": "1967-05-19",
                                            "country": "Norway"
                                        },
                                        {
                                            "name": "Scott Derrickson",
                                            "birthday": "1966-03-18",
                                            "country": "United States"
                                        }
                                    ]
                                },
                                {
                                    "name": "Keira Knightley",
                                    "birthday": "1985-03-26",
                                    "country": "United Kingdom",
                                    "directors": [
                                        {
                                            "name": "Morten Tyldum",
                                            "birthday": "1967-05-19",
                                            "country": "Norway"
                                        }
                                    ]
                                },
                                {
                                    "name": "Matthew Goode",
                                    "birthday": "1978-04-03",
                                    "country": "United Kingdom",
                                    "directors": [
                                        {
                                            "name": "Morten Tyldum",
                                            "birthday": "1967-05-19",
                                            "country": "Norway"
                                        }
                                    ]
                                },
                                {
                                    "name": "Rory Kinnear",
                                    "birthday": "1976-02-17",
                                    "country": "United Kingdom",
                                    "directors": [
                                        {
                                            "name": "Morten Tyldum",
                                            "birthday": "1967-05-19",
                                            "country": "Norway"
                                        }
                                    ]
                                },
                                {
                                    "name": "Allen Leech",
                                    "birthday": "1981-05-18",
                                    "country": "Ireland",
                                    "directors": [
                                        {
                                            "name": "Morten Tyldum",
                                            "birthday": "1967-05-19",
                                            "country": "Norway"
                                        }
                                    ]
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
                                    "country": "United Kingdom",
                                    "directors": [
                                        {
                                            "name": "Morten Tyldum",
                                            "birthday": "1967-05-19",
                                            "country": "Norway"
                                        },
                                        {
                                            "name": "Scott Derrickson",
                                            "birthday": "1966-03-18",
                                            "country": "United States"
                                        }
                                    ]
                                },
                                {
                                    "name": "Chiwetel Ejiofor",
                                    "birthday": "1977-07-10",
                                    "country": "United Kingdom",
                                    "directors": [
                                        {
                                            "name": "Scott Derrickson",
                                            "birthday": "1966-03-18",
                                            "country": "United States"
                                        }
                                    ]
                                },
                                {
                                    "name": "Rachel McAdams",
                                    "birthday": "1978-11-17",
                                    "country": "Canada",
                                    "directors": [
                                        {
                                            "name": "Scott Derrickson",
                                            "birthday": "1966-03-18",
                                            "country": "United States"
                                        }
                                    ]
                                },
                                {
                                    "name": "Benedict Wong",
                                    "birthday": "1971-06-03",
                                    "country": "United Kingdom",
                                    "directors": [
                                        {
                                            "name": "Scott Derrickson",
                                            "birthday": "1966-03-18",
                                            "country": "United States"
                                        }
                                    ]
                                },
                                {
                                    "name": "Tilda Swinton",
                                    "birthday": "1960-11-05",
                                    "country": "United Kingdom",
                                    "directors": [
                                        {
                                            "name": "Scott Derrickson",
                                            "birthday": "1966-03-18",
                                            "country": "United States"
                                        }
                                    ]
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
                                    "country": "USA",
                                    "directors": [
                                        {
                                            "name": "Ridley Scott",
                                            "birthday": "1937-11-30",
                                            "country": "United Kingdom"
                                        }
                                    ]
                                },
                                {
                                    "name": "Rutger Hauer",
                                    "birthday": "1944-01-23",
                                    "country": "Netherland",
                                    "directors": [
                                        {
                                            "name": "Ridley Scott",
                                            "birthday": "1937-11-30",
                                            "country": "United Kingdom"
                                        }
                                    ]
                                },
                                {
                                    "name": "Sean Young",
                                    "birthday": "1959-11-20",
                                    "country": "USA",
                                    "directors": [
                                        {
                                            "name": "Ridley Scott",
                                            "birthday": "1937-11-30",
                                            "country": "United Kingdom"
                                        }
                                    ]
                                },
                                {
                                    "name": "Edward James Olmos",
                                    "birthday": "1947-02-24",
                                    "country": "USA",
                                    "directors": [
                                        {
                                            "name": "Ridley Scott",
                                            "birthday": "1937-11-30",
                                            "country": "United Kingdom"
                                        }
                                    ]
                                },
                                {
                                    "name": "Daryl Hannah",
                                    "birthday": "1960-12-03",
                                    "country": "USA",
                                    "directors": [
                                        {
                                            "name": "Ridley Scott",
                                            "birthday": "1937-11-30",
                                            "country": "United Kingdom"
                                        }
                                    ]
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
                                    "country": "United Kingdom",
                                    "directors": [
                                        {
                                            "name": "Christopher Nolan",
                                            "birthday": "1970-06-30",
                                            "country": "United Kingdom"
                                        }
                                    ]
                                },
                                {
                                    "name": "Michael Caine",
                                    "birthday": "1933-03-14",
                                    "country": "United Kingdom",
                                    "directors": [
                                        {
                                            "name": "Christopher Nolan",
                                            "birthday": "1970-06-30",
                                            "country": "United Kingdom"
                                        }
                                    ]
                                },
                                {
                                    "name": "Aaron Eckhart",
                                    "birthday": "1968-03-12",
                                    "country": "USA",
                                    "directors": [
                                        {
                                            "name": "Christopher Nolan",
                                            "birthday": "1970-06-30",
                                            "country": "United Kingdom"
                                        }
                                    ]
                                },
                                {
                                    "name": "Morgan Freeman",
                                    "birthday": "1937-06-01",
                                    "country": "USA",
                                    "directors": [
                                        {
                                            "name": "Christopher Nolan",
                                            "birthday": "1970-06-30",
                                            "country": "United Kingdom"
                                        }
                                    ]
                                },
                                {
                                    "name": "Heath Ledger",
                                    "birthday": "1978-04-04",
                                    "country": "Australia",
                                    "directors": [
                                        {
                                            "name": "Christopher Nolan",
                                            "birthday": "1970-06-30",
                                            "country": "United Kingdom"
                                        }
                                    ]
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
                                    "country": "USA",
                                    "directors": [
                                        {
                                            "name": "Christopher Nolan",
                                            "birthday": "1970-06-30",
                                            "country": "United Kingdom"
                                        }
                                    ]
                                },
                                {
                                    "name": "Joseph Gordon-Levitt",
                                    "birthday": "1981-02-17",
                                    "country": "USA",
                                    "directors": [
                                        {
                                            "name": "Christopher Nolan",
                                            "birthday": "1970-06-30",
                                            "country": "United Kingdom"
                                        }
                                    ]
                                },
                                {
                                    "name": "Ellen Page",
                                    "birthday": "1987-02-21",
                                    "country": "Canada",
                                    "directors": [
                                        {
                                            "name": "Christopher Nolan",
                                            "birthday": "1970-06-30",
                                            "country": "United Kingdom"
                                        }
                                    ]
                                },
                                {
                                    "name": "Tom Hardy",
                                    "birthday": "1977-09-15",
                                    "country": "United Kingdom",
                                    "directors": [
                                        {
                                            "name": "Christopher Nolan",
                                            "birthday": "1970-06-30",
                                            "country": "United Kingdom"
                                        }
                                    ]
                                },
                                {
                                    "name": "Marion Cotillard",
                                    "birthday": "1975-09-30",
                                    "country": "France",
                                    "directors": [
                                        {
                                            "name": "Christopher Nolan",
                                            "birthday": "1970-06-30",
                                            "country": "United Kingdom"
                                        }
                                    ]
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
                                    "country": "Lebanon",
                                    "directors": [
                                        {
                                            "name": "Lana Wachowski",
                                            "birthday": "1965-06-21",
                                            "country": "United States"
                                        },
                                        {
                                            "name": "Lilly Wachowski",
                                            "birthday": "1967-12-29",
                                            "country": "United States"
                                        }
                                    ]
                                },
                                {
                                    "name": "Laurence Fishburne",
                                    "birthday": "1961-07-30",
                                    "country": "USA",
                                    "directors": [
                                        {
                                            "name": "Lana Wachowski",
                                            "birthday": "1965-06-21",
                                            "country": "United States"
                                        },
                                        {
                                            "name": "Lilly Wachowski",
                                            "birthday": "1967-12-29",
                                            "country": "United States"
                                        }
                                    ]
                                },
                                {
                                    "name": "Carrie-Anne Moss",
                                    "birthday": "1967-08-21",
                                    "country": "Canada",
                                    "directors": [
                                        {
                                            "name": "Lana Wachowski",
                                            "birthday": "1965-06-21",
                                            "country": "United States"
                                        },
                                        {
                                            "name": "Lilly Wachowski",
                                            "birthday": "1967-12-29",
                                            "country": "United States"
                                        }
                                    ]
                                },
                                {
                                    "name": "Hugo Weaving",
                                    "birthday": "1960-04-04",
                                    "country": "Nigeria",
                                    "directors": [
                                        {
                                            "name": "Lana Wachowski",
                                            "birthday": "1965-06-21",
                                            "country": "United States"
                                        },
                                        {
                                            "name": "Lilly Wachowski",
                                            "birthday": "1967-12-29",
                                            "country": "United States"
                                        }
                                    ]
                                }
                            ]
                        }
                    ];
                    let obtainedResult = await testingClient.query({ query: MOVIES, variables });

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
                            expect(actor).toHaveProperty('directors');
                            expect(actor.directors).toHaveLength(expectedResult[movieIndex].actors[actorIndex].directors.length);

                            actor.directors.map((director, directorIndex) => {
                                expect(director).not.toHaveProperty('id');
                                expect(director).toHaveProperty('name');
                                expect(director.name).toBe(expectedResult[movieIndex].actors[actorIndex].directors[directorIndex].name);
                                expect(director).toHaveProperty('birthday');
                                expect(director.birthday).toBe(expectedResult[movieIndex].actors[actorIndex].directors[directorIndex].birthday);
                                expect(director).toHaveProperty('country');
                                expect(director.country).toBe(expectedResult[movieIndex].actors[actorIndex].directors[directorIndex].country);
                            });
                        });
                    });

                    done();
                });
            });
            describe('running single queries asking for \'scoutbase_rating\' field ...', () => {
                const MOVIES = `
                    query {
                        movies {
                            scoutbase_rating
                            title
                        }
                    }
                `;
                test('with no token provided, it must return an warning message.', async (done) => {
                    const server = new ApolloServerBase({
                        typeDefs,
                        resolvers,
                        schemaDirectives,
                        context: {}
                    });
                    const testingClient = createTestClient(server);
                    const scoutbaseRatingMessage: string = 'Login required.';
                    let expectedResult: GqlMovieInterface[] = [
                        {
                            "scoutbase_rating": scoutbaseRatingMessage,
                            "title": "The Imitation Game"
                        },
                        {
                            "scoutbase_rating": scoutbaseRatingMessage,
                            "title": "Doctor Strange"
                        },
                        {
                            "scoutbase_rating": scoutbaseRatingMessage,
                            "title": "Blade Runner"
                        },
                        {
                            "scoutbase_rating": scoutbaseRatingMessage,
                            "title": "The Dark Knight"
                        },
                        {
                            "scoutbase_rating": scoutbaseRatingMessage,
                            "title": "Inception"
                        },
                        {
                            "scoutbase_rating": scoutbaseRatingMessage,
                            "title": "The Matrix"
                        }
                    ];
                    let obtainedResult = await testingClient.query({ query: MOVIES, variables });

                    expect(obtainedResult).not.toBeNull();
                    expect(obtainedResult).toHaveProperty('data');
                    expect(obtainedResult.data).not.toBeNull();
                    expect(obtainedResult.data).toHaveProperty('movies');
                    expect(obtainedResult.data.movies).not.toBeNull();
                    expect(obtainedResult.data.movies).toHaveLength(expectedResult.length);

                    obtainedResult.data.movies.map((obtainedMovie, index) => {
                        expect(obtainedMovie).not.toHaveProperty('id');
                        expect(obtainedMovie).toHaveProperty('scoutbase_rating');
                        expect(obtainedMovie.scoutbase_rating).toBe(expectedResult[index].scoutbase_rating);
                        expect(obtainedMovie).toHaveProperty('title');
                        expect(obtainedMovie.title).toBe(expectedResult[index].title);
                    });

                    done();
                });
                test('with an out of date token provided, it must return an error message.', async (done) => {
                    const server = new ApolloServerBase({
                        typeDefs,
                        resolvers,
                        schemaDirectives,
                        context: { token: outOfDateToken }
                    });
                    const testingClient = createTestClient(server);
                    const scoutbaseRatingMessage: string = 'Token not valid.';
                    let expectedResult: GqlMovieInterface[] = [
                        {
                            "scoutbase_rating": scoutbaseRatingMessage,
                            "title": "The Imitation Game"
                        },
                        {
                            "scoutbase_rating": scoutbaseRatingMessage,
                            "title": "Doctor Strange"
                        },
                        {
                            "scoutbase_rating": scoutbaseRatingMessage,
                            "title": "Blade Runner"
                        },
                        {
                            "scoutbase_rating": scoutbaseRatingMessage,
                            "title": "The Dark Knight"
                        },
                        {
                            "scoutbase_rating": scoutbaseRatingMessage,
                            "title": "Inception"
                        },
                        {
                            "scoutbase_rating": scoutbaseRatingMessage,
                            "title": "The Matrix"
                        }
                    ];
                    let obtainedResult = await testingClient.query({ query: MOVIES, variables });

                    expect(obtainedResult).not.toBeNull();
                    expect(obtainedResult).toHaveProperty('data');
                    expect(obtainedResult.data).not.toBeNull();
                    expect(obtainedResult.data).toHaveProperty('movies');
                    expect(obtainedResult.data.movies).not.toBeNull();
                    expect(obtainedResult.data.movies).toHaveLength(expectedResult.length);

                    obtainedResult.data.movies.map((obtainedMovie, index) => {
                        expect(obtainedMovie).not.toHaveProperty('id');
                        expect(obtainedMovie).toHaveProperty('scoutbase_rating');
                        expect(obtainedMovie.scoutbase_rating).toBe(expectedResult[index].scoutbase_rating);
                        expect(obtainedMovie).toHaveProperty('title');
                        expect(obtainedMovie.title).toBe(expectedResult[index].title);
                    });

                    done();
                });
                test('with an up of date token provided, it must return a valid random value between 5.0 and 9.0.', async (done) => {
                    const server = new ApolloServerBase({
                        typeDefs,
                        resolvers,
                        schemaDirectives,
                        context: { token: generateUpToDateToken(60*60) }
                    });
                    const testingClient = createTestClient(server);
                    let expectedResult: GqlMovieInterface[] = [
                        {
                            "title": "The Imitation Game"
                        },
                        {
                            "title": "Doctor Strange"
                        },
                        {
                            "title": "Blade Runner"
                        },
                        {
                            "title": "The Dark Knight"
                        },
                        {
                            "title": "Inception"
                        },
                        {
                            "title": "The Matrix"
                        }
                    ];
                    let obtainedResult = await testingClient.query({ query: MOVIES, variables });

                    expect(obtainedResult).not.toBeNull();
                    expect(obtainedResult).toHaveProperty('data');
                    expect(obtainedResult.data).not.toBeNull();
                    expect(obtainedResult.data).toHaveProperty('movies');
                    expect(obtainedResult.data.movies).not.toBeNull();
                    expect(obtainedResult.data.movies).toHaveLength(expectedResult.length);

                    obtainedResult.data.movies.map((obtainedMovie, index) => {
                        expect(obtainedMovie).not.toHaveProperty('id');
                        expect(obtainedMovie).toHaveProperty('scoutbase_rating');
                        expect(parseFloat(obtainedMovie.scoutbase_rating)).toBeGreaterThanOrEqual(5.0);
                        expect(parseFloat(obtainedMovie.scoutbase_rating)).toBeLessThanOrEqual(9.0);
                        expect(obtainedMovie).toHaveProperty('title');
                        expect(obtainedMovie.title).toBe(expectedResult[index].title);
                    });

                    done();
                });
            });
        });
    });
});