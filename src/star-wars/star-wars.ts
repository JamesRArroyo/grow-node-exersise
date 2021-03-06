import * as express from 'express';
import axios from 'axios';
import { Person, Planet } from './star-wars.interfaces';

 
export class StarWarsAPI {
  public router = express.Router();
  private rootUrl = 'http://swapi.co/api';
 
  constructor() {
    this.intializeRoutes();
  }
 
  public intializeRoutes() {
    this.router.get('/people', this.getPeople);
    this.router.get('/planets', this.getPlanets);
  }
 
  private getPeople = async (req: express.Request, res: express.Response) => {
    const url = `${this.rootUrl}/people`;
    const queryParams = req.query;
    let people = await this.getAllRecords(url);
    
    // Query Params
    if(queryParams.sortBy) {
      people = this.sortBy(<Person[]>people, queryParams.sortBy);
    }

    res.send(people);
  }
 
  private getPlanets = async (req: express.Request, res: express.Response) => {
    const peopleUrl = `${this.rootUrl}/people`;
    const planetsUrl = `${this.rootUrl}/planets`;

    const records = await Promise.all([this.getAllRecords(planetsUrl), this.getAllRecords(peopleUrl)]);
    const planets: Planet[]  = <Planet[]> records[0];
    const people: Person[] = <Person[]>records[1];

    // Create people map
    let peopleMap = {};
    people.forEach((p: Person) => peopleMap[p.url] = p);

    // Map planet residents
    planets.forEach((planet: Planet) => {
      planet.residents = planet.residents.map((resident: string) => peopleMap[resident]);
    })

    res.send(planets);
  }

  private sortBy(people: Person[], param: string): Person[] {
    const key = param.toLowerCase();
    switch (key) {
        case 'name':
            return people.sort((a: any, b: any) => {
                return (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
            });
        case 'mass':
        case 'height':
            return people.sort((a: any, b: any) => a[key] - b[key]);
        default:
            console.info(`INFO | Unsupported sorting param attempt: ${param}`);
            return people;
        }
  }




  /*******************************************************************
   ** ALL OF THE FUNCTIONS BELOW SHOULD BE EXTRACTED INTO A BASE CLASS
   *******************************************************************/

  /**
   * Returns all of the records
   */
  private async getAllRecords(url): Promise<Person[] | Planet[]> {
    let allRecords = [];
    try {
      const response = await axios.get(url);
      const totalRecords = response.data.count || 0;
      const itemsPerPage = response.data.results.length || 10;
      const numberOfPages = this.numberOfPages(totalRecords, itemsPerPage);

      const promisePages = await this.createPagePromises(url, numberOfPages);
      const pageResponses = await Promise.all(promisePages);
      allRecords = this.mergeResponsesResults(pageResponses);

    } catch (error) {
      console.error(error);
    }

    return Promise.resolve(allRecords);

  }

  /**
   * Returns the number of paginated pages.
   */
  private numberOfPages(totalRecords: number, itemsPerPage: number): number {
    return Math.ceil(totalRecords / itemsPerPage);
  }

  /**
   * Returns an array of axios http promises for each page.
   */
  private createPagePromises(url: string, totalPages: number) {
    const promises = [];
    for (let i = 1; i <= totalPages; i++) {
      const promise = axios.get(`${url}?page=${i}`);
      promises.push(promise)
    }
    return promises;
  }

  /**
   * Returns a flattened array of results based off of many http responses.
   */
  private mergeResponsesResults(responses: any[]): Person[] | Planet[] {
    const results = responses.map((response: any) => response.data.results);
    return [].concat(...results);
  }
}
 
export default StarWarsAPI;