import { Router } from "express";
import env from '../env';
import RubiesBankService from '../services/rubiesbank.service';

class RubiesBankRoute {
    public loadRoutes(prefix: string, router: Router) {
        this.virtualActCallback(prefix, router);
    }
    private virtualActCallback(prefix: string, router: Router) {
        router.post(prefix+`/${env.rubieVirtualActCallbackUrl}`, RubiesBankService.virtualActCallBack)
    }
}
export default new RubiesBankRoute;