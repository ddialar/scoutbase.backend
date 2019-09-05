import logger   from '@logger';
import entities from '@entities/index';
import {
    createConnection,
    ConnectionOptions,
    Connection
} from 'typeorm';

const connectionParams: ConnectionOptions = {
    name: 'default',
    type: 'mysql',
    database: process.env.ORM_DATABASE_NAME!,
    host: process.env.ORM_HOST!,
    port: parseInt(process.env.ORM_PORT!),
    username: process.env.ORM_USERNAME!,
    password: process.env.ORM_PASSWORD!,
    entities
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