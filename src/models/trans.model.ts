import * as mongoose from 'mongoose'

const TraansSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['fundSaving', 'fundInvestment','fundWallet', 'withdraw'],
        required: true
    },
    source: {
        type: String,
        enum: ['card', 'bank-transfer', 'wallet'],
    },
    desc: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'failed', 'success'],
        required: true,
        default: 'pending'
    },
    transId: {
        type: String,
    },
    createdDate : {
        type: Number,
        required: true,
        default: () => Date.now()
    }
}) 
const TransModel = mongoose.model('transactions', TraansSchema);
export default TransModel;