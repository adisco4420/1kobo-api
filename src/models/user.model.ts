import * as mongoose from "mongoose";

export let UserSchema = new mongoose.Schema({
    userType: {
        type: String,
        enum: ['user', 'admin', 'affilate'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    profilePix: {
        type: String,
    },
    walletBalance: {
        type: Number,
        default: 0,
        select: false
    },
    referredBy: {
        type: String,
        select: false
    },
    infoSource: {
        type: String,
        enum: ['facebook', 'twitter', 'instagram'],
        select: false
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        select: false
    },
    address: {
        type: {
            street: { type: String},
            city: { type: String},
            state: { type: String},
            postalCode: { type: Number},
            country: { type: String}
        },
        select: false
    },
    bankInfo: {
        type: {
            bankName: {type: String},
            actName: {type: String},
            actNumber: {type: String},
            bankCode: {type: String},
            swiftCode: {type: String},
        },
        select: false
    },
    createdAt: {
        type: Number,
        required: true,
        default: () => Date.now(),
        select: false
    },
});

const UserModel = mongoose.model('users', UserSchema)
export default UserModel