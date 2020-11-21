import { RootController } from './_root.control';
import UserModel from '../models/user.model'

class UserController extends RootController {
    constructor() {
        super(UserModel)
    }
}  
export default new UserController