import * as connection from './connection.services';
import * as movies     from './movies.services';

const orm = {
    ...connection,
    ...movies
}

export default orm;