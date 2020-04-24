import * as express from 'express';
import { Request, Response } from 'express';
import { Tasks } from './routes/tasks';
let requestCount: number = 1;
let urlDictionary: object = {};

class App {
    public app: express.Application;
    public taskRoutes: Tasks = new Tasks();

    constructor() {
        this.app = express();
        this.config();
        this.taskRoutes.routes(this.app);
    }
    //Middlewares
    //Middleware_02: Tracking URLs
    TrackURL = (req: Request, res: Response, next: Function) => {
        const currentURL: string = req.originalUrl;
        if (currentURL in urlDictionary) {
            urlDictionary[`${currentURL}`] = urlDictionary[`${currentURL}`] + 1;
        } else {
            urlDictionary[`${currentURL}`] = 1;
        }
        next();
    };

    //Middleware_01: Log all request body
    Logger = (req: Request, res: Response, next: Function) => {
        console.log("=========================================================");
        const currentURL: string = req.originalUrl;
        console.log(`Request Number: ${requestCount} \r\n Request Method: ${req.method} \r\n Request original URL: ${req.originalUrl} \n Request URL: ${req.url} \n Request Body: ${JSON.stringify(req.body)}`);
        console.log(`Number of Times: ${urlDictionary[`${currentURL}`]}`);
        console.log("=========================================================");
        requestCount++;
        next();
    };

    private config(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(this.Logger);
        this.app.use(this.TrackURL);
    }
}

export default new App().app;