import mongoose = require("mongoose"); 
import env from '../env';
import chalk = require('chalk');

export const dbConfig = () => {
    mongoose.set('useCreateIndex', true);
    mongoose.set('useNewUrlParser', true)
    mongoose.set('useUnifiedTopology', true);
    mongoose.set('useFindAndModify', false);
   
    // Connect to MongoDB
    mongoose.connect(env.MONGODB_URI)
    .then(() => {
      console.log('✌🏾 Successfully connected to MongoDB');
    })
    .catch(err => {
      console.log(chalk.red.bgBlack.bold('An error occured while conencting to MongoDB', err));
    });
}
