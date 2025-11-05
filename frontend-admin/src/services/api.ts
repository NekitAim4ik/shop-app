import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ILoginBody, ILoginResponseBody, ILoginConfigmBody, ILoginConfirmResponseBody } from "../dto/IAuth";
import { Mutex } from "async-mutex";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    baseUrl: '/api/v1',
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();

    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        if(!mutex.isLocked()) {
            const release = await mutex.acquire();

            try {
                const refreshResult = await baseQuery(
                    {
                        url: '/auth/refresh',
                        method: 'POST',
                    },
                    api,
                    extraOptions
                );

                if(refreshResult.data) {
                    const newAccessToken = (refreshResult.data as ILoginConfirmResponseBody).accessToken;

                    localStorage.setItem('accessToken', newAccessToken);

                    result = await baseQuery(args, api, extraOptions);
                } else {
                    localStorage.removeItem('accessToken');
                    window.location.href = '/login';
                }
            } finally {
                release();
            }
        } else {
            await mutex.waitForUnlock();

            result = await baseQuery(args, api, extraOptions);
        }
    } 

    return result;
}

export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,

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