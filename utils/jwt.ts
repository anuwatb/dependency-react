import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'production-secret-key';

export const jwttoken = {
    sign: (payload: object) => {
        try {
            return jwt.sign(payload, JWT_SECRET);
        } catch (e) {
            throw new Error('Failed to authenticate token');
        }
    },
    verify: (token: string | undefined = '') => {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (e) {
            console.log('Failed to authenticate token');
        }
    }
};