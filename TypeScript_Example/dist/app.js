"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const tasks_1 = require("./routes/tasks");
let requestCount = 1;
let urlDictionary = {};
class App {
    constructor() {
        this.taskRoutes = new tasks_1.Tasks();
        //Middlewares
        //Middleware_02: Tracking URLs
        this.TrackURL = (req, res, next) => {
            const currentURL = req.originalUrl;
            if (currentURL in urlDictionary) {
                urlDictionary[`${currentURL}`] = urlDictionary[`${currentURL}`] + 1;
            }
            else {
                urlDictionary[`${currentURL}`] = 1;
            }
            next();
        };
        //Middleware_01: Log all request body
        this.Logger = (req, res, next) => {
            console.log("=========================================================");
            const currentURL = req.originalUrl;
            console.log(`Request Number: ${requestCount} \r\n Request Method: ${req.method} \r\n Request original URL: ${req.originalUrl} \n Request URL: ${req.url} \n Request Body: ${JSON.stringify(req.body)}`);
            console.log(`Number of Times: ${urlDictionary[`${currentURL}`]}`);
            console.log("=========================================================");
            requestCount++;
            next();
        };
        this.app = express();
        this.config();
        this.taskRoutes.routes(this.app);
    }
    config() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(this.Logger);
        this.app.use(this.TrackURL);
    }
}
exports.default = new App().app;
