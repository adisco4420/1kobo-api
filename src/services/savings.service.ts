import { Response, Request } from 'express';
import { RootService, Status } from './_root.service';
import SavingsControl from '../controllers/savings.control';
import { SavingsI, UserRequestI } from '../interfaces/interface';
import { add , isFuture } from 'date-fns'
import RubiesBankService from './rubiesbank.service';
import savingsControl from '../controllers/savings.control';
import { calculateUtils, dateUtils, planTypesUtil } from '../utilities/general.util';
import TransService from './trans.service';

class SavingsService extends RootService {
    planTypes = planTypesUtil
    private validateInput = (payload: SavingsI) => {
        const { frequency, planType, amount, duration } = payload;
        let result = {status: true, msg: null}
        const minimumDuration = this.planTypes[planType].minDuration[frequency];
        const maximumDuration = this.planTypes[planType].maxDuration[frequency];
        const minAmount = this.planTypes[planType].minAmount;
        if(duration < minimumDuration || duration > maximumDuration) {
            const time = frequency === 'daily' ? 'days' :  frequency === 'weekly' ? 'weeks' : 'months'  
            const msg = `Duration must be between ${minimumDuration} ${time} and ${maximumDuration} ${time}`
            result = {status: false, msg};
        } else if(amount < minAmount) { 
            const msg = `Minimum amount must be up to ${minAmount}`;
            result = {status: false, msg};
        }
        return {status: result.status, msg: result.msg}
    }

    create = async (req: UserRequestI, res: Response) => {
        try {
            const { status, msg } = this.validateInput(req.body);
            if(!status) throw {status: Status.FAILED_VALIDATION, data: {msg}};
            if(!(isFuture(new Date(req.body.startDate)))) throw {status: Status.FAILED_VALIDATION, msg: 'startDate must be a future date'}
            
            const withdrawFee = calculateUtils.withdrawFee({planType: req.body.planType});
            const interestRate = calculateUtils.savingsInterest(req.body);
            const totalInterest = (req.body.amount * req.body.duration) + interestRate;
            const payoutAmount = totalInterest - (withdrawFee * interestRate)
            const payload = {
                ...req.body, 
                userId: req.user._id,
                payoutAmount,
                maturityDate: dateUtils.getMaturityDate(req.body)
            };
            console.log({payoutAmount});
            
            const save = await SavingsControl.create({...payload});
            const virtalactnfo = {user: {...req.user}, ...this.jsonize(save), ...payload, planType: 'savings'}
            const bankInfo =  await RubiesBankService.createPlanVirtualact(virtalactnfo);
            this.sendResponse({status: Status.SUCCESS, data: {payload: bankInfo}}, res);
            await savingsControl.updateById(save._id, {virtualAct: bankInfo})
            TransService.create({
                amount: req.body.amount,
                userId: req.user._id,
                type: 'createSaving',
                desc: `New savings plan (${req.body.name})`,
                status: 'success',
                createdDate: Date.now(),
            })
        } catch ({status, ...error}) {
            console.log(error);
            const statusx = status ? status : Status.ERROR
            this.sendResponse({status: statusx, data: error}, res)
        }
    }
    getUserSavings = async (req: UserRequestI, res: Response) => {
        try {
            const userSavings = await SavingsControl.getAll({userId: req.user._id} ,req.query)
            this.sendResponse({status: Status.SUCCESS, data: userSavings}, res);
        } catch ({status, ...error}) {
            const statusx = status ? status : Status.ERROR
            this.sendResponse({status: statusx, data: error}, res)
        }
    }
    fundPlan = ({planId, amount}) => {
        const promise = new Promise(async (resolve, reject) => {
            try {
                const plan = await SavingsControl.updateOne({_id: planId, amount}, {
                    $set: {status: 'active', lastPaymentDate: Date.now()}, $inc: {paymentCount: 1}, 
                });
                if(!(plan && plan.n)) throw 'plan not found';
                
                const planx = await SavingsControl.getById(planId);
                const planObj = this.jsonize(planx);

                if(planObj.paymentCount === 1) {
                    const startDate = Date.now();
                    const maturityDate = dateUtils.getMaturityDate({...planObj, startDate})
                    const updatePlan = await SavingsControl.updateById(planId, {startDate, maturityDate})                    
                    if(!(updatePlan)) throw 'update plan not found';
                }
                resolve(plan);

            } catch (error) {
                reject(error);
            }
        })
        return promise;
    }
}
export default new SavingsService;
