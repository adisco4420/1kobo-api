import { Response, Request } from 'express';
import { RootService, Status } from './_root.service';
import SavingsControl from '../controllers/savings.control';
import { UserRequestI } from '../interfaces/interface';
import { add , isFuture } from 'date-fns'


class SavingsService extends RootService {
    private readonly interestRate = {
        daily: 0.266666,
        weekly: 2,
        monthly: 8
    }
    private calculateInterest = ({type, amount, duration}) => {
        const rate = this.interestRate[type] / 100;
        const interestRate = (rate * amount) * duration;
        return Math.round((interestRate + Number.EPSILON) * 100) / 100
    }
    private getMaturityDate = ({type, startDate, duration}) => {
        const time = type === 'daily' ? 'days' :  type === 'weekly' ? 'weeks' : 'months';
        var result = add(new Date(startDate), {[time]: duration, hours: 2});
        return new Date(result).getTime()
    }
    private validate = ({type, amount, duration}) => {        
        let result = {status: true, minDur: null, maxDur: null}
        switch (type) {
            case 'daily':
                if(!(duration >= 28 && duration <= 366)) result = {status: false, minDur: 28, maxDur: 366}                
                break;
            case 'weekly':
                if(!(duration >= 4 && duration <= 52)) result = {status: false, minDur: 4, maxDur: 52}
                break;
            case 'monthly':
                if(!(duration >= 2 && duration <= 12)) result = {status: false, minDur: 2, maxDur: 12}
                break;
            default:
                break;
        }
        const { status , minDur, maxDur} = result;        
        const time = type === 'daily' ? 'days' :  type === 'weekly' ? 'weeks' : 'months'  
        return {status, msg: `Duration must be between ${minDur} ${time} and ${maxDur} ${time}`}
    }

    create = async (req: UserRequestI, res: Response) => {
        try {
            const { status, msg } = this.validate(req.body);
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
            

            this.sendResponse({status: Status.SUCCESS, data: {save}}, res);
        } catch ({status, ...error}) {
            const statusx = status ? status : Status.ERROR
            this.sendResponse({status: statusx, data: error}, res)
        }
    }
}
export default new SavingsService;
