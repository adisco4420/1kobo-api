import TokenUtil from '../utilities/token.util';
import { RootService, Status } from '../services/_root.service';

class AuthMidWare extends RootService {
    auth() {
        return (req, res, next) => {   
            try {
                const authHeader = req.headers.authorization;
                if(!authHeader) return this.sendResponse({status: Status.UN_AUTHORIZED, data:'Please specify authorization header'}, res);
                const token = authHeader.split(' ')[1];
                const tokenData = TokenUtil.verify(token);
                if(req.url.includes('/users/confirm-email') || tokenData.isVerified) {                    
                    req.user = tokenData;
                    next();
                } else {
                    return this.sendResponse({status: Status.UN_AUTHORIZED, data:'you are not authorized unverified'}, res)
                }
            } catch (error) {
                return this.sendResponse({status: Status.UN_AUTHORIZED, data:'you are not authorized'}, res)
            }
        }
    }
}
export default new AuthMidWare().auth()