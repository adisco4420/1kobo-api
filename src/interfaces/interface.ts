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
export interface SavingsI {
    userId?: string;
    name: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    planType: 'bronze' | 'silver' | 'gold';
    amount: number;
    payoutAmount: number;
    paymentCount: number;
    duration: number;
    status: 'pending' | 'active' | 'completed';
    startDate: number;
    maturityDate?: number;
    createdDate?: number;
    virtualAct?: any;
}
export interface TransI {
    _id?: string;
    userId: string;
    amount: number;
    type: 'fundSaving' | 'fundInvestment'| 'fundWallet' | 'withdraw';
    desc: string;
    status: 'pending' | 'failed' | 'success' | 'terminated',
    transId?: string;
    createdDate: number;
    source?: 'card' | 'bank-transfer' | 'wallet'
}