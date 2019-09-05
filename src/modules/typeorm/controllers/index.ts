import * as connection from './connections.controllers';
import * as movies     from './movies.controllers';
import * as actors     from './actors.controllers';
import * as directors  from './directors.controllers';

const orm = {
    ...connection,
    ...movies,
    ...actors,
    ...directors
}

export default orm;