import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ILoginBody, ILoginResponseBody, ILoginConfigmBody, ILoginConfirmResponseBody } from "../dto/IAuth";

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1',
        credentials: 'include',
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

        confirmOtp: builder.mutation<ILoginConfirmResponseBody, ILoginConfigmBody>({
            query: (credentials) => ({
                url: '/auth/confirm/',
                method: 'POST',
                body: credentials,
            }),
        }),

    }),
});

export const {
    useSendOtpMutation,
    useConfirmOtpMutation
} = api;