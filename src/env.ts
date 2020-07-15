const dotenv = require('dotenv');
dotenv.config()

const env = {
    MONGODB_URI : process.env.MONGODB_URI,
    MAILGUN_KEY: process.env.MAILGUN_KEY,
    JWT_KEY: process.env.JWT_KEY,
    flutterwaveSecretHash: process.env.flutterwaveSecretHash
}
export default env;