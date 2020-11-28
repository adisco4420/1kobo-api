import * as mongoose from 'mongoose'

const TraansSchema = new mongoose.Schema({
    planType: {
        type: String,
        enum: ['sabings', 'daily'],
    },
    
}) 