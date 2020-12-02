import { Request, Response} from 'express';
import axios from 'axios';
import env from '../env';
import { RootService, Status } from './_root.service';
import VirtualactTx from '../controllers/virtualact-tx.control';
import SavingsService from './savings.service';
import TransService from './trans.service';

class RubiesBankService extends RootService {
    private api = 'https://openapi.rubiesbank.io/v1';
    private apikey = env.rubiesBankApiKey;
    private callbackurl = `${env.hostUrl}/rubies-bank/${env.rubieVirtualActCallbackUrl}`

    constructor() {
        super();
        this.AxoisInterceptor()
    }
    private AxoisInterceptor() {
        axios.interceptors.request.use((config) => {
            if(this.apikey && config.url.includes(this.api)) {
                config.headers['Authorization'] =  this.apikey;
            }
            return config
        })
    }
    private simulatedVirtualActCreation(): Promise<any> {
        const randomAct = `${Date.now()}`.substring(0, 10);
        const promise = new Promise((resolve) => {
            const data = {
                virtualaccountname: 'Sodiq Alabi', 
                virtualaccount: `${randomAct}`, 
                amount: "1000",
            }
            resolve({data});
        }) 
        return promise;
    }
    private getActiveDays = ({type, duration}) => {
        const dayx = type === 'monthly' ?  30 :  type === 'weekly' ? 7 : 1;
        return (dayx * duration) + 5;
    }
    createPlanVirtualact = async (body) => {
        const promise = new Promise(async (resolve, reject) => {
            try {
                const payload = {
                    virtualaccountname: `${body.user.firstName} ${body.user.lastName}`,
                    amountcontrol: 'FIXEDAMOUNT',
                    daysactive: this.getActiveDays(body),
                    minutesactive: 30,
                    amount: `${body.amount}`,
                    callbackurl: this.callbackurl
                }
                // const { data  } = await axios.post(`${this.api}/createvirtualaccount`, payload); 

                const { data } = await this.simulatedVirtualActCreation()
                const { _id: planId, planType, amount, userId } = body;
                const { virtualaccount, virtualaccountname} = data
                resolve(data)
                VirtualactTx.createRecord({planType, planId, amount, userId, virtualaccount, virtualaccountname})
            } catch (error) {
                const err = error.response && error.response.data ? error.response.data  : error
                reject(err)
            }
        })
        return promise
    }
    virtualActCallBack = async (req: Request, res: Response) => {
        try {
            console.log('=====Virtual Act Callback==='); 
            const { amount, craccount: virtualaccount, originatorname, originatoraccountnumber, paymentreference  } = req.body;
            const amountNo = Number(amount);
            const virtalActTxAwait = await VirtualactTx.getOne({virtualaccount});
            if(!virtalActTxAwait) throw 'virtualact Txes not found';

            const virtalActTx = this.jsonize(virtalActTxAwait);            
            const { planId, planType, userId} = virtalActTx;
            if(planType === 'savings') {
                await SavingsService.fundPlan({planId, amount: amountNo})
            } else if(planType === 'investments') {
                console.log('investment funding...');
            }
            const transType = planType === 'savings' ? 'fundSaving': planType === 'investments' ? 'fundInvestment': 'fundWallet'
            TransService.create({
                amount: amountNo,
                userId,
                type: transType,
                desc: `Fund ${planType} plan via bank transfer`,
                status: 'success',
                createdDate: Date.now(),
                source: 'bank-transfer',
                transId: paymentreference
            })

            this.sendResponse({status: Status.SUCCESS, data: 'Account Funding Successful'}, res);
        } catch (error) {
            this.sendResponse({status: Status.ERROR, data: error}, res)
        }
    }
}
export default new RubiesBankService