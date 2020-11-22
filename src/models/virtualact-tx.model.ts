import * as mongoose from 'mongoose';

const VirtualactTxSchema = new mongoose.Schema({
    virtualaccount: {
        type: Number,
        required: true
    },
    virtualaccountname: {
        type: String,
        required: true
    },
    planType: {
        type: String,
        enum: ['savings', 'investments'],
        required: true,
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    createdDate: {
        type: Number,
        required: true,
        default: () => Date.now()
    }

})
const VirtualactTxModel = mongoose.model('virtualact-tx', VirtualactTxSchema)
export default VirtualactTxModel;
