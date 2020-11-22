import * as joi from 'joi';

class UserValidator {
    public create = joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        email: joi.string().email({minDomainSegments: 2}).required(),
        phoneNumber: joi.string().min(11).max(12).required(),
        password: joi.string().required(),
        referredBy: joi.string(),
        infoSource: joi.string()
    }) 
    public login = joi.object({
        email: joi.string().email({minDomainSegments: 2}).required(),
        password: joi.string().required(),
    })
    public edit = joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        address: joi.object({
            street: joi.string().required(),
            city: joi.string().required(),
            state: joi.string().required(),
            postalCode: joi.number().required(),
            country: joi.string().required()
        }),
        bankInfo: joi.object({
            bankName: joi.string().required(),
            bankCode: joi.string().required(),
            actName: joi.string().required(),
            actNumber: joi.string().required(),
            swiftCode: joi.string().required()
        })
    }) 
}
export default new UserValidator; 