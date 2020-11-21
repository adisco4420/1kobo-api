import * as express from "express";
import chalk = require('chalk');

import SampleRoute from './sample.route';
import UserRoute from './user.route';
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

    //use router middleware
    app.use(router);

    app.all('*', (req, res)=> {
      return res.status(404).json({ status: 404, error: 'not found' });
    });
}