import { Request } from 'express'

export interface SampleI {
    _id: string;
    name: string;
    description?: string;
    createdAt: number;
}
export interface UserI {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    isVerified?: boolean;
    password?: string;
    walletBalance? : number
}
export interface UserRequestI extends Request {
    user?: UserI;
}