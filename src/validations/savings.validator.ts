import * as joi from 'joi';

class SavingsValidator {
    public create = joi.object({
        name : joi.string().required(),
        type: joi.string().valid('daily', 'weekly', 'monthly').required(),
        amount: joi.number().min(100).max(5000000).required(),
        duration: joi.number().required(),
        startDate: joi.number().required(),
    })
} 
export default new SavingsValidator;