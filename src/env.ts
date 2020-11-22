const dotenv = require('dotenv');
dotenv.config()

const randomStr = 'e98dec370c9252025ed190bfbfa9d196';

const env = {
    MONGODB_URI : process.env.MONGODB_URI,
    JWT_KEY: process.env.JWT_KEY,
    MAILGUN_KEY : process.env.MAILGUN_KEY,
    hostUrl: 'https://onekobo-api.herokuapp.com',
    rubieVirtualActCallbackUrl: `virtualAct/callback/${randomStr}`,
    rubiesBankApiKey: process.env.rubiesBankApiKey
}
export default env;