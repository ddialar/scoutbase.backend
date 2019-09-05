import * as connection from './connections.controllers';
import * as movies     from './movies.controllers';
import * as actors     from './actors.controllers';

const orm = {
    ...connection,
    ...movies,
    ...actors
}

export default orm;