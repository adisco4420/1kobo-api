import * as joi from 'joi';

class SavingsValidator {
    public create = joi.object({
        name : joi.string().required(),
        frequency: joi.string().valid('daily', 'weekly', 'monthly').required(),
        planType: joi.string().valid('bronze', 'silver', 'gold').required(),
        amount: joi.number().required(),
        duration: joi.number().required(),
        startDate: joi.number().required(),
    })
} 
export default new SavingsValidator;