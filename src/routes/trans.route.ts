import { Router } from "express";
import Joi from '../middlewares/validator.midware';
import AuthMidWare from '../middlewares/auth.midware';
import TransService from '../services/trans.service';

class TransRoute {
    public loadRoutes(prefix: string, router: Router) {
        this.getUserTrans(prefix, router)
    }
    getUserTrans(prefix: string, router: Router) {
        router.get(`${prefix}/user`, AuthMidWare, TransService.getUserTrans)
    }
}
export default new TransRoute