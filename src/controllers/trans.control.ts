import { RootController } from './_root.control';
import TransModel from '../models/trans.model'

class TransControl extends RootController {
    constructor() {
        super(TransModel)
    }
}  
export default new TransControl;