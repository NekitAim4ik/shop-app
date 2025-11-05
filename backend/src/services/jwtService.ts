import jwt from 'jsonwebtoken';

export function generateAccessToken(email: string) {
    return jwt.sign(
    { email },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: '15m' }
  );
}

export function generateRefreshToken(email: string) {
    return jwt.sign(
        { email },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: '30d' }
    );
}

export function verifyAccessToken(token: string) {
    try {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
    } catch (err) {
        throw new Error('Invalid access token');
    }
}

export function verifyRefreshToken(token: string) {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
    } catch (err) {
        throw new Error('Invalid refresh token');
    }
}