import { UserI } from './../interfaces/interface';
import env from '../env';
import axios from 'axios';
import VirtualactTx from '../controllers/virtualact-tx.control';


class RubiesBankService {
    private api = 'https://openapi.rubiesbank.io/v1';
    private apikey = env.rubiesBankApiKey;

    constructor() {
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
                    callbackurl: `${env.hostUrl}/rubies-bank/${env.rubieVirtualActCallbackUrl}`
                }
                const { data  } = await axios.post(`${this.api}/createvirtualaccount`, payload); 
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
}
export default new RubiesBankService