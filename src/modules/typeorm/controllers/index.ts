import * as connection from './connections.controllers';
import * as movies     from './movies.controllers';

const orm = {
    ...connection,
    ...movies
}

export default orm;