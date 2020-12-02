import { UserI } from './../interfaces/interface';
import { Response, Request } from 'express';
import TokenUtil from '../utilities/token.util';
import EncryptUtil from '../utilities/encrypt.util'

import { RootService, Status } from './_root.service';
import UserControl from '../controllers/user.control';
import EmailService from './email.service';
import { UserRequestI } from '../interfaces/interface';

class UserService extends RootService {
    create = async (req: Request, res: Response) => {
        try {
            const uniqueEmail = await UserControl.unique({email: req.body.email})
            const uniquePhoneNo = await UserControl.unique({phoneNumber: req.body.phoneNumber})
            if(uniqueEmail && uniquePhoneNo) {
                req.body.password = await EncryptUtil.hash(req.body.password);
                const user = await UserControl.create(req.body)
                this.sendResponse({status: Status.SUCCESS, data: {msg: 'User Registered Successful'}}, res)
                const token = TokenUtil.sign({_id: user._id}, '5h')
                EmailService.confirmEmail({token, ...this.jsonize(user)})
            } else {                
                let msg =  !uniqueEmail ? 'email already exists' : 'phone number already exists';
                this.sendResponse({status: Status.FAILED_VALIDATION, data: {msg}},res)
            }
        } catch (error) {            
            this.sendResponse({status: Status.ERROR, data: error},res)
        }
    }
    confirmEmail = async (req: UserRequestI, res: Response) => {
        try {
            const user = await UserControl.updateById(req.user._id, {isVerified: true});
            if(user) {
                const payload = TokenUtil.sign(this.jsonize(user), '1d');
                this.sendResponse({status: Status.SUCCESS, data: {payload}}, res)
            } else {
                this.sendResponse({status: Status.PRECONDITION_FAILED, data: {msg: 'User confirm failed'}}, res)
            }
        } catch (error) {
            this.sendResponse({status: Status.ERROR, data: error},res)
        } 
    }
    login = async (req: UserRequestI, res: Response) => {
        try {
            const user = await UserControl.getOne({email: req.body.email}, '+password');
            if(!user) return this.sendResponse({status: Status.UN_AUTHORIZED, data: {msg: 'Invalid Credentials'}}, res)
            const userObj: UserI = this.jsonize(user);
            const validPwd = await EncryptUtil.compare(req.body.password, userObj.password);
            if(!validPwd) return this.sendResponse({status: Status.UN_AUTHORIZED, data: {msg: 'Invalid Credentials'}}, res)
            if(!userObj.isVerified) return this.sendResponse({status: Status.PRECONDITION_FAILED, data: {msg: 'Your account is not verified'}}, res)
            const { password, ...rest } = userObj;
            const payload = TokenUtil.sign(rest, '1d');
            this.sendResponse({status: Status.SUCCESS, data: {payload}}, res)
        } catch (error) { 
            this.sendResponse({status: Status.ERROR, data: error}, res)
        }
    }
    resendConfirmEmail = async (req: UserRequestI, res: Response) => {
        try {
            const user = await UserControl.getOne({email: req.params.email});
            if(!user) throw {msg: 'resend confirm email failed'};
            const userObj: UserI = this.jsonize(user);
            if(userObj.isVerified) throw {status: Status.UNPROCESSABLE_ENTRY, msg: 'Your account is already verified'};
            this.sendResponse({status: Status.SUCCESS, data: {msg: 'Verification email has been sent'}}, res)
            const token = TokenUtil.sign({_id: userObj._id}, '5h');
            EmailService.confirmEmail({token, ...userObj})
        } catch ({status, ...error}) {
            const statusx = status ? status : Status.ERROR
            this.sendResponse({status: statusx, data: error}, res)
        }
    }
    profile = async (req: UserRequestI, res: Response) => {
        try { 
            const select = '+referredBy +infoSource +walletBalance +gender +address +bankInfo +createdAt'
            const user = await UserControl.getById(req.user._id, select);
            if(!user) throw {msg: 'user profile failed'};
            this.sendResponse({status: Status.SUCCESS, data: {msg:'User profile', payload: user}}, res)
        } catch ({status, ...error}) {
            const statusx = status ? status : Status.ERROR
            this.sendResponse({status: statusx, data: error}, res)
        }
    }
    editProfile = async (req: UserRequestI, res: Response) => {
        try {
            const user = await UserControl.updateById(req.user._id, {...req.body});
            if(!user) throw {msg: 'user update failed'};
            this.sendResponse({status: Status.SUCCESS, data: {msg:'User profile updated', payload: user}}, res)
        } catch (error) {
            this.sendResponse({status: Status.ERROR, data: error}, res)
        }
    }  
}
export default new UserService;