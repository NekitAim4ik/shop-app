import jwt from 'jsonwebtoken';
export function generateAccessToken(email) {
    return jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
}
export function generateRefreshToken(email) {
    return jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}
//# sourceMappingURL=jwtService.js.map