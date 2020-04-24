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
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const mongoConfig = {
    serverUrl: "mongodb://localhost:27017/",
    database: "Chang-LunWei-CS554-Lab1"
};
let _connection = undefined;
let _db = undefined;
class MongoConnect {
    getDB() {
        return __awaiter(this, void 0, void 0, function* () {
            if (_connection === undefined) {
                _connection = yield MongoClient.connect(mongoConfig.serverUrl);
                _db = yield _connection.db(mongoConfig.database);
            }
            return _db;
        });
    }
}
exports.MongoConnect = MongoConnect;
