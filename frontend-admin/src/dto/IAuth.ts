export interface ILoginBody {
    email: string
}

export interface ILoginResponseBody {
    message: string
}

export interface ILoginConfigmBody {
    email: string
    otp: string
}

export interface ILoginConfirmResponseBody {
    access: string
}