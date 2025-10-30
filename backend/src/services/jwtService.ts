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
        { expiresIn: '7d' }
    );
}