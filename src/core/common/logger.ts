import { configure, getLogger } from 'log4js';

var loggerConfiguration = {
    appenders: {
        out: { 
            type: 'console',
            layout: {
                type: 'pattern',
                pattern: '[%r] [%[%5.5p%]] - %[%m%]'
            }
        },
        app: {
            type: 'file',
            layout: {
                type: 'pattern',
                pattern: '[%d] [%5.5p] - %m%'
            },
            filename: `${process.env.LOGGER_FOLDER}${process.env.LOGGER_FILE}`
        },
    },
    categories: {
        default: { 
            appenders: process.env.NODE_ENV !== 'production' ? ['out', 'app'] : ['app'],
            level: process.env.LOGGER_LEVEL!
        }
    }
};

configure(loggerConfiguration);
const logger = getLogger();

export default logger;


// No se puede asignar un argumento de tipo
// {
//     appenders: {
//         out: {
//             type: string; 
//             layout: { 
//                 type: string; 
//                 pattern: string; 
//             }; 
//         }; 
//         app: { 
//             type: string; 
//             layout: { 
//                 type: string; 
//                 pattern: string; 
//             }; 
//             filename: string; 
//         }; 
//     }; 
//     categories: { 
//         default: { 
//             appenders: string[]; 
//             level: string | undefined; 
//         }; 
//     }; 
// }

// al parámetro de tipo "Configuration".
//   Los tipos de propiedad 'categories' no son compatibles.
//     El tipo 
//     { 
//         default: { 
//             appenders: string[]; 
//             level: string | undefined; 
//         }; 
//     }
//     no se puede asignar al tipo 
//     { 
//         [name: string]: { 
//             appenders: string[]; 
//             level: string; 
//             enableCallStack?: boolean | undefined; 
//         }; 
//     }.
//       La propiedad 'default' es incompatible con la signatura de índice.
//         El tipo 
//         { 
//             appenders: string[]; 
//             level: string | undefined;
//         }
//         no se puede asignar al tipo 
//         { 
//             appenders: string[]; 
//             level: string; 
//             enableCallStack?: boolean | undefined; 
//         }
//           Los tipos de propiedad 'level' no son compatibles.
//             El tipo 'string | undefined' no se puede asignar al tipo 'string'.
//               El tipo 'undefined' no se puede asignar al tipo 'string'.