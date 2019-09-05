import * as connection from './connections.controllers';
import * as users      from './users.controllers';
import * as movies     from './movies.controllers';
import * as actors     from './actors.controllers';
import * as directors  from './directors.controllers';

const orm = {
    ...connection,
    ...users,
    ...movies,
    ...actors,
    ...directors
}

export default orm;