# Back-end task of Code Challenge for Scoutbase

## NOTE: Project exaplantion after the test instructions block

This task is for demonstrating your understanding of HTTP, GraphQL, Node.js and general API practices.

Instructions:

1. Implement a Node.js-based server with raw `http`, Koa or Express.
2. Add a `/graphql` endpoint serving the apollo-server or any other GraphQL implementation.
3. Schema must be able to return proper response for the following public query:

```graphql
{
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
```

4. Add support for the following mutation:
```graphql
mutation createUser($username: String, $password: String) {
  createUser(username: $username, password: $password) {
    token
    user {
      id
      name
    }
  }
}
```

5. To expand on the number four, add a mutation-based authentication that accepts:
```graphql
mutation login($username: String, $password: String) {
  login(username: $username, password: $password) {
    token
    user {
      id
      name
    }
  }
}
```

6. Authenticated users may request additional fields for the query used earlier. New `scoutbase_rating` field must return the a random string between 5.0-9.0:

```graphql
{
  movies {
    scoutbase_rating

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
```

7. `/graphql` must be accessible for external clients.

8. End.

# Project exaplantion

![NodeJS](https://img.shields.io/badge/NodeJS-v12.10.0-blue)
![Apollo Server](https://img.shields.io/badge/Apollo%20Server-v2.9.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-v3.6.2-blue)
![TypeORM](https://img.shields.io/badge/TypeORM-v0.2.18-blue)
![Docker](https://img.shields.io/badge/Docker-v19.3.2-blue)
![Tests](https://img.shields.io/badge/tests-72%20passed%20%7C%200%20failed%20%7C%200%20skiped-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-Branches%2080.85%25%20%7C%20Functions%2099.02%25%20%7C%20Lines%2095.92%25-brightgreen)

## Summary.

I've structured the project using a Ports&Adapters architecture because I think that it's a really good option in order to the project scalability and maintainability.

As entry point of this architecture I have used Apollo Server in order to implement the demanded queries and mutations.

All queries hare implemented into the `request.json` file located into the `docs/insomnia/` folder. As you can guess, I've used Insomnia in order to run and check the different queries and mutations.

I've implemented the SQL persistance layer using two separated Docker containers (for development and for testing). This containers run a MySQL database which are preseeded on the container creation time.

In order to communicate the backend with the persistance layer, I've used TypeORM because I think that it's independent enougth of the database engine and in addition, it provides a really nice abstraction form the database.

I've implemented a set of testing suites based on Jest. Totally, I've created 72 tests (all in green) and I've reached an average of code coverage of 91,03%.

Finally, I've implemente the whole project using TypeScript, as well as Webpack in order to transpile it.

## Start up instructions.

**Note**: Check that Doker is running on your system.

```sh
git clone https://github.com/ddialar/scoutbase.backend
cd scoutbase.backend
npm i
npm run docker:compose
npm run build:dev
```

## Test resolution.

### 1. Implement a Node.js-based server with raw `http`, Koa or Express.

Due to I use Apollo Server, I don't need to user any of these proposed options.

### 2. Add a `/graphql` endpoint serving the apollo-server or any other GraphQL implementation.

Done. This poing code can be found into the `src/server.ts` file.

In order to create the different GraphQL entities, I've used `graphql-import` that allows me to segment the schema in different files and merge all of them in a single one on the transpiling process.

The GraphQL structure can be find into the `src/modules/graphql/` folder.

### 3. Schema must be able to return proper response for the following public query:

```graphql
{
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
```

Meanwhile I was working on this point, I detected that the query is asking for `directors` at the sale level of `actors` so I understood that you are asking for the directos who a specific actor has worked with.

However, I also though that this anomaly could be an error and you really want to retrieve the movies' directors, so due to I can do both options, I finally implemented the needed code in order to successfully run the next query:

```graphql
{
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
    # Here I retrieve the movie's directors.
    directors {
      name
      birthday
      country
    }
  }
}
```

### 4. Add support for the following mutation:
```graphql
mutation createUser($username: String, $password: String) {
  createUser(username: $username, password: $password) {
    token
    user {
      id
      name
    }
  }
}
```

when I analyzed this mutation, it had not sense for me because you are trying to create a new user and retrieve its name but in the method signature, you are not providing any additional information.

Besides that, you are asking for the new user's token when it has not done login yet so it's not possible to provide a valid token. It's true that the `token` field could be returned as an empty string, but I didn't like that option.

Based on that, I edited the mutation in order to use this one:

```graphql
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

# Variables content.
{
	"data": {
		"name": "Elena",
		"username": "emartin",
		"password": "123456"
	}
}
```

As you can see, I've replaced the `username` and `password` input field for an object which contains these fields and the new user's `name`. This way, if it's needed to refact the mutation because we have to attach new field, we just need to insert them into the variable and the mutation signature won't change.

Besides that, due to this kind of method likely throw an error, I've implemented the `ApiError` entity and using GraphQL fragments, depending on we have run a success operation or it has crashed, we'll receive a specific data type.

### 5. To expand on the number four, add a mutation-based authentication that accepts:
```graphql
mutation login($username: String, $password: String) {
  login(username: $username, password: $password) {
    token
    user {
      id
      name
    }
  }
}
```

Done.

In order to generate the authenticated user's token, I've used JWT. This way, besides to generate the users' tokens, when the code received any request that provide this kind of tokens, we can check if that token is valid or it doesn't.

### 6. Authenticated users may request additional fields for the query used earlier. New `scoutbase_rating` field must return the a random string between 5.0-9.0:

```graphql
{
  movies {
    scoutbase_rating

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
```

Done. To do that I've implemented a GraphQL directive which analyze the token provided in the context object and determines if it's valid or not.

Depending on the validation result, this directive returns:
- The required value.
- Login requires. (If no token has been provided).
- Token not valid.

These are the possible values that will be passed to the `scoutbase_rating` field when it's included in the query.

### 7. `/graphql` must be accessible for external clients.

Done. The endpoing is accessible for any connection in the port 4500 however, Playground and instrospection are only available for `development` mode.