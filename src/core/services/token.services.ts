import logger   from '@logger';

import * as jwt from 'jsonwebtoken';

interface JwtPayloadInterface {
    sub: string
};
interface JwtOptionsInterface {
    algorithm: string
    expiresIn: number
};

const encodeToken = (username: string): string => {
    try {
        logger.trace('(encodeJwt) - Encoding JWT token ...');

        let payload: JwtPayloadInterface = {
            sub: username
        }
        let secret: string = process.env.JWT_KEY!;
        let options: JwtOptionsInterface = {
            algorithm: process.env.JWT_ALGORITHM || 'HS512',
            expiresIn: parseInt(process.env.JWT_EXPIRATION_TIME_SECONDS!) || 60
        };
        let encodedToken: string =  jwt.sign(payload, secret, options);
    
        logger.trace('(encodeJwt) - JWT token successfully encoded.');
        return encodedToken;
    } catch (error) {
        logger.error(`(encodeJwt) - ${error.message} ${error.description}`);
        throw new Error(error.message);
    }
};

const decodeToken = (userToken: string) => {
    try {
        logger.trace('(verifyJwt) - Decoding JWT token ...');

        let decodedToken = jwt.verify(userToken, process.env.JWT_KEY!);

        logger.info('(dencodeJwt) - JWT token successfully decoded.');
        return decodedToken;
    } catch (error) {
        logger.error(`(verifyJwt) - ${error.message} ${error.description}`);
        throw new Error ('Token not valid.');
    }
};

export {
    encodeToken,
    decodeToken
};