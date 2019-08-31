import { DirectorInterface } from '@interfaces';
import * as ports            from '@ports';

export default {
    Actor: {
        directors: (parentValue: any, args: any, context: any, astData: any): DirectorInterface[] => {
            return ports.getDirectorsByActorId(parentValue.id);
        }
    },
};
