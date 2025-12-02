export interface ILoginBody {
    email: string
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