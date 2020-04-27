"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//const MongoClient: {connect: Function} = mongodb.MongoClient;
const MongoClient = require('mongodb').MongoClient;
const mongoConfig = {
    serverUrl: "mongodb://localhost:27017/",
    database: "test"
    //database: "TS_Database"
};
let _connection = undefined;
let _db = undefined;
class MongoConnect {
    getDB() {
        return __awaiter(this, void 0, void 0, function* () {
            if (_connection === undefined) {
                console.log("_connection === undefined");
                console.log(`mongoConfig.serverUrl = ${mongoConfig.serverUrl}`);
                //_connection = await MongoClient.connect(mongoConfig.serverUrl);
                _connection = yield MongoClient.connect(mongoConfig.serverUrl, { useUnifiedTopology: true });
                console.log("initialized connection");
                console.log(`_connection = ${_connection}`);
                _db = yield _connection.db(mongoConfig.database);
                console.log("initialized _db");
            }
            console.log("return db");
            return _db;
        });
    }
}
exports.MongoConnect = MongoConnect;
