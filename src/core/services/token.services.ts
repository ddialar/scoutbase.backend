import logger   from '@logger';

import * as jwt from 'jwt-simple';

interface JwtPayloadInterface {
    sub: string
    iat: number
    exp: number
};

const encodeToken = (username: string): string => {
    try {
        // validate.users.username(username, 'The user name must be defined in order to encode the token.');
        // validate.users.userRoleValue(role, 'The user role must be defined in order to encode the token.');

        logger.trace('(encodeJwt) - Encoding JWT token ...');

        let encodedToken: string = '';
        let payload: JwtPayloadInterface = {
            sub: username,
            iat: new Date().getTime(),
            exp: (new Date().getTime()) + 60000
        }

        encodedToken = jwt.encode(payload, process.env.JWT_KEY || '');
    
        logger.trace('(encodeJwt) - JWT token successfully encoded.');
        return encodedToken;
    } catch (error) {
        logger.error(`(encodeJwt) - ${error.message} ${error.description}`);
        throw new Error(error.message);
    }
};

// const decodeJwt = (userToken) => {
//     try {
//         validate.users.userToken(userToken, 'The user token must be defined in order to decode it.');
        
//         logger.trace('(decodeJwt) - Decoding JWT token ...');

//         let decodedToken = jwt.decode(userToken, authorizationConf.jwt.key);
//         logger.info('(dencodeJwt) - JWT token successfully decoded.');
//         return decodedToken;
//     } catch (error) {
//         logger.error(`(decodeJwt) - ${error.message} ${error.description}`);
//         throw new ApiError.UnauthorizedTokenInvalid((error.description) ? error.description : error.message);
//     }
// };

// const validateToken = (userToken) => {
//     try {
//         validate.users.userToken(userToken, 'The user token must be defined in order to validate it.');

//         logger.trace('(validateToken) - Validatting JWT token ...');

//         let tokenDecoded;
        
//         try { 
//             tokenDecoded = decodeJwt(userToken);
//         } catch (error) {
//             throw new ApiError.UnauthorizedTokenExpired('The token is out of date.');
//         }

//         logger.info('(validateToken) - JWT token successfully validated.');
//         return tokenDecoded;
//     } catch (error) {
//         logger.error(`(validateToken) - ${error.message} ${error.description}`);
//         throw new ApiError.RuntimeError(error.code, error.message, error.description);
//     }
// };

export {
    encodeToken
};