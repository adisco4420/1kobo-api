import { RootService } from './_root.service';
import { TransI } from "../interfaces/interface";
import TransControl from '../controllers/trans.control';

class TransService extends RootService {
    create = async (payload: TransI): Promise<TransI> => {
        const promise:Promise<TransI> = new Promise(async (resolve, reject) => {
            try {
                const trans = await TransControl.create({...payload});
                const transObj: TransI = this.jsonize(trans);
                resolve(transObj)
            } catch (error) {
                reject(error)
            }
        });
        return promise;
    }
}
export default new TransService;