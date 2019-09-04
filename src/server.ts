import logger           from '@logger';
import * as path        from 'path';

import { importSchema } from 'graphql-import';
import { ApolloServer } from 'apollo-server';
import resolvers        from '@resolvers';
import schemaDirectives from '@directives';

import orm              from '@orm';

const schemaAbsolutePath: string = path.join(process.env.PWD!, 'src/modules/graphql/schema.graphql');
const typeDefs = importSchema(schemaAbsolutePath);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    context: ({ req }) => ({
        token: req.headers.authorization
    }),
    playground: (process.env.NODE_ENV === 'development') ? true : false,
    introspection: (process.env.NODE_ENV === 'development') ? true : false
});

const main = async () => {
    // TODO: Connect the ORM.
    try {
        await orm.connect();
        server
            .listen({ port: process.env.GRAPHQL_SERVER_PORT })
            .then(({ url }) => logger.info(`(server) - Server ready at ${url}`));
    } catch (error) {
        logger.error(`(server) - ${error.message}`);
    }
}

main();

declare const module: any;
if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => server.stop());
}