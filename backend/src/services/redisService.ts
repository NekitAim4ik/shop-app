import redis from 'redis';

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

export async function verifyOtp(email: string, providedOtp: string) {
    const storedOtp = await client.get(`otp:${email}`);

    return storedOtp === providedOtp;
}

export async function deleteOtp(email: string) {
    await client.del(`otp:${email}`);
}

export default connectRedis;