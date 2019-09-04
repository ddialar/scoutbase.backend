import logger from '@logger';
import {
    createConnection,
    ConnectionOptions,
    Connection
} from 'typeorm';

const connectionParams: ConnectionOptions = {
    type: "mysql",
    database: process.env.ORM_DATABASE_NAME!,
    host: process.env.ORM_HOST!,
    port: parseInt(process.env.ORM_PORT!),
    username: process.env.ORM_USERNAME!,
    password: process.env.ORM_PASSWORD!
};

export const connect = async (): Promise<Connection> => {
    let connection = await createConnection(connectionParams);
    logger.info('(orm) - Connection successfully stablished.');
    return connection;
};