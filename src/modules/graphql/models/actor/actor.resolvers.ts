import { DirectorInterface } from '@interfaces';
import * as ports            from '@ports';

export default {
    Actor: {
        directors: async (parentValue: any, args: any, context: any, astData: any): Promise<DirectorInterface[]> => {
            return await ports.getDirectorsByActorId(parentValue.id);
        }
    },
};
