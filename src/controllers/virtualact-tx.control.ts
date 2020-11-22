import { RootController } from './_root.control';
import VirtualactTxModel from '../models/virtualact-tx.model'

class VirtualactControl extends RootController {
    constructor() {
        super(VirtualactTxModel)
    }
    createRecord = async (payload) => {
        try {
            await this.create({...payload})
        } catch (error) {
            console.log(error);
        }
    }
}  
export default new VirtualactControl;