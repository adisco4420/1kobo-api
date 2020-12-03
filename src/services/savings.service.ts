import { Response, Request } from 'express';
import { RootService, Status } from './_root.service';
import SavingsControl from '../controllers/savings.control';
import { SavingsI, UserRequestI } from '../interfaces/interface';
import { add , isFuture } from 'date-fns'
import RubiesBankService from './rubiesbank.service';
import savingsControl from '../controllers/savings.control';

class SavingsService extends RootService {
    private readonly interestRate = {
        daily: 0.266666,
        weekly: 2,
        monthly: 8
    }
    private maxDuration = {daily: 360, weekly: 48, monthly: 12};
    private planTypes = {
        bronze: {
            rate: {daily: 0.166666, weekly: 1.25, monthly: 5}, 
            minAmount: 5000, minDuration: { daily: 120, weekly: 16, monthly: 4}, maxDuration: {...this.maxDuration}
        },
        silver: {
            rate: {daily: 0.25, weekly: 1.875, monthly: 7.5}, 
            minAmount: 15000, minDuration: {daily: 180, weekly: 24, monthly: 6}, maxDuration: {...this.maxDuration}
        },
        gold: {
            rate: {daily: 0.33333, weekly: 2.5, monthly: 10}, 
            minAmount: 30000, minDuration: {daily: 360, weekly: 48, monthly: 12}, maxDuration: {...this.maxDuration}
        } 
    } 
    private calculateInterest = (payload: SavingsI): number => {
        const {frequency, planType,  amount, duration} = payload;
        const rate = this.planTypes[planType].rate[frequency] / 100;
        const interestRate = (rate * amount) * duration;
        return Math.round((interestRate + Number.EPSILON) * 100) / 100
    }
    private getMaturityDate = (payload: SavingsI) => {
        const { frequency, duration, startDate} = payload;
        const time = frequency === 'daily' ? 'days' :  frequency === 'weekly' ? 'weeks' : 'months';
        var result = add(new Date(startDate), {[time]: duration, hours: 2});
        return new Date(result).getTime()
    }
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
            
            const durationAmount = req.body.amount * req.body.duration
            const payload = {
                ...req.body, 
                userId: req.user._id,
                payoutAmount: this.calculateInterest(req.body) + durationAmount,
                maturityDate: this.getMaturityDate(req.body)
            }
            const save = await SavingsControl.create({...payload});
            const virtalactnfo = {user: {...req.user}, ...this.jsonize(save), ...payload, planType: 'savings'}
            const bankInfo =  await RubiesBankService.createPlanVirtualact(virtalactnfo);
            this.sendResponse({status: Status.SUCCESS, data: {payload: bankInfo}}, res);
            await savingsControl.updateById(save._id, {virtualAct: bankInfo})
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
                    $set: {status: 'active'}, $inc: {paymentCount: 1}, 
                });
                if(!(plan && plan.n)) throw 'plan not found';
                
                resolve(plan);
            } catch (error) {
                reject(error);
            }
        })
        return promise;
    }
}
export default new SavingsService;
