import { RootService, Status } from './_root.service';
import { Request, Response } from 'express';
import { TransI, UserRequestI } from "../interfaces/interface";
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
    getUserTrans = async (req: UserRequestI, res: Response) => {
        try {
            const userTrans = await TransControl.getAll({userId: req.user._id} ,req.query)
            this.sendResponse({status: Status.SUCCESS, data: userTrans}, res);
        } catch ({status, ...error}) {
            const statusx = status ? status : Status.ERROR
            this.sendResponse({status: statusx, data: error}, res)
        }
    }
}
export default new TransService;