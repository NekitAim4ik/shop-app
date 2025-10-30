declare function connectRedis(): Promise<void>;
export declare function storeOTP(email: string, otp: string): Promise<void>;
export declare function verifyOtp(email: string, providedOtp: string): Promise<boolean>;
export declare function deleteOtp(email: string): Promise<void>;
export default connectRedis;
//# sourceMappingURL=redisService.d.ts.map