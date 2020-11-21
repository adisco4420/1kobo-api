import { Router } from "express";
import Joi from '../middlewares/validator.midware';
import UserService from '../services/user.service';
import UserValidator from '../validations/user.validator';
import AuthMidWare from '../middlewares/auth.midware';

class UserRoute {
    loadRoutes(prefix: string, router: Router) {
        this.create(prefix, router)
        this.confirmEmail(prefix, router)
        this.login(prefix, router)
        this.resendConirmEmail(prefix, router)
        this.profile(prefix, router)
        this.editProfile(prefix, router)
    }
    private create(prefix: string, router: Router) {
        router.post(`${prefix}/register`, Joi.vdtor(UserValidator.create), UserService.create)
    }
    private confirmEmail(prefix: string, router: Router) {
        router.get(`${prefix}/confirm-email`, AuthMidWare , UserService.confirmEmail)
    }
    private login(prefix: string, router: Router) {
        router.post(`${prefix}/login`, Joi.vdtor(UserValidator.login), UserService.login)
    }
    private resendConirmEmail(prefix: string, router: Router) {
        router.get(`${prefix}/resend-confirm-email/:email` , UserService.resendConfirmEmail)
    }
    private profile(prefix: string, router: Router) {
        router.get(`${prefix}/profile`, AuthMidWare , UserService.profile)
    }
    private editProfile(prefix: string, router: Router) {
        router.patch(`${prefix}/edit-profile`, Joi.vdtor(UserValidator.edit), AuthMidWare, UserService.editProfile)
    }


}
export default new UserRoute 