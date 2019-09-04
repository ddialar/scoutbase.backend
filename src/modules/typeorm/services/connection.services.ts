import logger from '@logger';
import {
    createConnection,
    ConnectionOptions,
    Connection
} from 'typeorm';
import { movies } from '../models/entities/movies';

const connectionParams: ConnectionOptions = {
    name: 'default',
    type: 'mysql',
    database: process.env.ORM_DATABASE_NAME!,
    host: process.env.ORM_HOST!,
    port: parseInt(process.env.ORM_PORT!),
    username: process.env.ORM_USERNAME!,
    password: process.env.ORM_PASSWORD!,
    entities: [movies]
};

export const connect = async (): Promise<Connection> => {
    let connection = await createConnection(connectionParams);
    logger.info('(orm) - Connection successfully stablished.');
    return connection;
};