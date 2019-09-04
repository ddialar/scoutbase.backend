import logger               from '@logger';
import {
    createConnection,
    ConnectionOptions,
    Connection
} from 'typeorm';
import { movies }           from '../models/entities/movies';
import { directors }        from '../models/entities/directors';
import { actors }           from '../models/entities/actors';
import { movies_actors }    from '../models/entities/movies_actors';
import { movies_directors } from '../models/entities/movies_directors';
import { actors_directors } from '../models/entities/actors_directors';

const connectionParams: ConnectionOptions = {
    name: 'default',
    type: 'mysql',
    database: process.env.ORM_DATABASE_NAME!,
    host: process.env.ORM_HOST!,
    port: parseInt(process.env.ORM_PORT!),
    username: process.env.ORM_USERNAME!,
    password: process.env.ORM_PASSWORD!,
    entities: [
        movies,
        directors,
        actors,
        movies_actors,
        movies_directors,
        actors_directors
    ]
};

var connection: Connection;

export const connect = async (): Promise<Connection> => {
    if (connection) {
        await disconnect();
    }

    connection = await createConnection(connectionParams);
    logger.info('(orm) - Connection successfully stablished.');
    return connection;
};

export const disconnect = async (): Promise<void> => {
    if (connection) {
        await connection.close();
        logger.info('(orm) - Connection successfully closed.');
    }
};