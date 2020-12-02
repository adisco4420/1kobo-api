import * as express from "express";
import chalk = require('chalk');

import SampleRoute from './sample.route';
import UserRoute from './user.route';
import SavingsRoute from './savings.route';
import RubiesBankRoute from './rubiesbank.route';

/**
 * Create and return Router.
 *
 * @class Server
 * @method config
 * @return void
 */
export const routes = (app: express.Application) => {
    let router: express.Router;
    router = express.Router();

    console.log(chalk.yellow.bgBlack.bold("Loading sample routes"));
    SampleRoute.loadRoutes('/samples', router);  
    console.log(chalk.yellow.bgBlack.bold("Loading users routes"));
    UserRoute.loadRoutes('/users', router);  
    console.log(chalk.yellow.bgBlack.bold("Loading savings routes"));
    SavingsRoute.loadRoutes('/savings', router);
    console.log(chalk.yellow.bgBlack.bold("Loading rubies bank routes"));
    RubiesBankRoute.loadRoutes('/rubies-bank', router);

    router.get('/', (req, res) => res.send('Welcome to 1Kobo-Api'))
 
    //use router middleware
    app.use(router);

    app.all('*', (req, res)=> {
      return res.status(404).json({ status: 404, error: 'not found' });
    });
}