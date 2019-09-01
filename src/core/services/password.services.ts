import * as bcrypt from 'bcryptjs';

const encodePassword = async (plainPassword: string): Promise<string> => {
    let salt = await bcrypt.genSalt(Number.parseInt(process.env.BCRYPT_SALT_ROUNDS || '1'));
    return await bcrypt.hash(plainPassword, salt);
};

const comparePassword = async (plainPassword: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hash);
};

export {
    encodePassword,
    comparePassword
};