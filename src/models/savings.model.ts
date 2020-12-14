import { object } from "joi";
import * as mongoose from "mongoose";

let SavingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: true
    },
    planType: {
        type: String,
        enum: ['bronze', 'silver', 'gold'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    payoutAmount: {
        type: Number,
        required: true,
    },
    paymentCount: {
        type: Number,
        required: true,
        default: 0
    },
    lastPaymentDate: {
        type: Number,
    },
    duration: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'terminated'],
        required: true,
        default: 'pending'
    },
    virtualAct: {
        type: Object,
    },
    startDate: {
        type: Number,
        required: true
    },
    maturityDate: {
        type: Number,
        required: true
    },
    createdDate: {
        type: Number,
        required: true,
        default: () => Date.now()
    }
})
const savingsModel = mongoose.model('savings', SavingsSchema);
export default savingsModel