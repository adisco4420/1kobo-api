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
    type: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 100,
        max: 5000000
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
    duration: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed'],
        required: true,
        default: 'pending'
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