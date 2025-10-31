import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface ILoginBody {
    email: string
}

interface ILoginResponseBody {
    message: string
}

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),

    tagTypes: [],

    endpoints: (builder) => ({
        sendOtp: builder.mutation<ILoginResponseBody, ILoginBody>({
            query: (credentials) => ({
                url: '/auth/login/',
                method: 'POST',
                body: credentials,
            }),
        }),

    }),
});

export const {
    useSendOtpMutation
} = api;