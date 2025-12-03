export interface ILoginBody {
    email: string
    password: string
}

export interface ILoginConfirmBody {
    email: string
    otp: string
}

export interface IRegisterBody {
    sname: string
    name: string
    email: string
    password: string
}

export interface User {
    sname: string
    name: string
    email: string
    password: string
}