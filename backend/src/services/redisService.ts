import redis from 'redis';
import { type User } from '../dto/IAuth.js';

const client = redis.createClient({ url: process.env.REDIS_URL as string });

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
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    process.exit(1);
  }
}

export async function storeOTP(email: string, otp: string) {
    const expirySeconds = Number(process.env.OTP_EXPIRY_MINUTES) * 60;

    await client.setEx(`otp:${email}`, expirySeconds, otp);
}

export async function storePass(email: string, password: string) {
    const expirySeconds = Number(process.env.OTP_EXPIRY_MINUTES) * 60;

    await client.setEx(`pending:${email}`, expirySeconds, password);
}

export async function getPass(email: string) {
    const password = client.get(`pending:${email}`);

    return password;
}

export async function storeUser(user: User) {
    const expirySeconds = Number(process.env.OTP_EXPIRY_MINUTES) * 60;

    await client.setEx(`pending:${user.email}`, expirySeconds, JSON.stringify(user));
}

export async function getUser(email: string) {
    const user = client.get(`pending:${email}`);

    return user;
}

export async function verifyOtp(email: string, providedOtp: string) {
    const storedOtp = await client.get(`otp:${email}`);

    return storedOtp === providedOtp;
}

export async function deleteOtp(email: string) {
    await client.del(`otp:${email}`);
}

export async function deletePending(email: string) {
    await client.del(`pending:${email}`);
}

export default connectRedis;