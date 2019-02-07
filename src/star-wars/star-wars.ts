import * as express from 'express';
 
export class StarWarsAPI {
  public router = express.Router();
 
  constructor() {
    this.intializeRoutes();
  }
 
  public intializeRoutes() {
    this.router.get('/people', this.getPeople);
    this.router.get('/planets', this.getPlanets);
  }
 
  getPeople = (req: express.Request, res: express.Response) => {
    res.send('people');
  }
 
  getPlanets = (req: express.Request, res: express.Response) => {
    res.send('planets');
  }
}
 
export default StarWarsAPI;