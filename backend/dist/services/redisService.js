import redis from 'redis';
const client = redis.createClient({ url: process.env.REDIS_URL });
client.on('error', (err) => {
    console.error('Redis Client Error:', err);
});
client.on('connect', () => {
    console.log('Redis connected successfully');
});
async function connectRedis() {
    try {
        await client.connect();
        console.log('Redis client connected');
    }
    catch (error) {
        console.error('Failed to connect to Redis:', error);
        process.exit(1);
    }
}
export async function storeOTP(email, otp) {
    const expirySeconds = Number(process.env.OTP_EXPIRY_MINUTES) * 60;
    await client.setEx(`otp:${email}`, expirySeconds, otp);
}
export async function verifyOtp(email, providedOtp) {
    const storedOtp = await client.get(`otp:${email}`);
    return storedOtp === providedOtp;
}
export async function deleteOtp(email) {
    await client.del(`otp:${email}`);
}
export default connectRedis;
//# sourceMappingURL=redisService.js.map