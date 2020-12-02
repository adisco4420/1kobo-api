const dotenv = require('dotenv');
dotenv.config()

const randomStr = '0e26631fe2dc119725479203e2d002b1';

const env = {
    MONGODB_URI : process.env.MONGODB_URI,
    JWT_KEY: process.env.JWT_KEY,
    MAILGUN_KEY : process.env.MAILGUN_KEY,
    hostUrl: 'https://onekobo-api.herokuapp.com',
    rubieVirtualActCallbackUrl: `virtualAct/callback/${randomStr}`,
    rubiesBankApiKey: process.env.rubiesBankApiKey
}
export default env;