import { RootController } from './_root.control';
import SavingsModel from '../models/savings.model'

class SavingsControl extends RootController {
    constructor() {
        super(SavingsModel)
    }
}  
export default new SavingsControl;