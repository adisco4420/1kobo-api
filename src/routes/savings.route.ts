import { Router } from "express";
import Joi from '../middlewares/validator.midware';
import AuthMidWare from '../middlewares/auth.midware';
import SavingsVdtor from '../validations/savings.validator';
import SavingsService from '../services/savings.service';

class SavingsRoute {
    public loadRoutes(prefix: string, router: Router) {
        this.create(prefix, router)
        this.getUserSavings(prefix, router)
    }
    create(prefix: string, router: Router) {
        router.post(`${prefix}`, Joi.vdtor(SavingsVdtor.create), AuthMidWare, SavingsService.create)
    }
    getUserSavings(prefix: string, router: Router) {
        router.get(`${prefix}/user`, AuthMidWare, SavingsService.getUserSavings)
    }
}
export default new SavingsRoute