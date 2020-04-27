import * as mongodb from "mongodb";
//const MongoClient: {connect: Function} = mongodb.MongoClient;
const MongoClient: {connect: Function} = require('mongodb').MongoClient;

const mongoConfig: {serverUrl: string, database: string} = {
  serverUrl: "mongodb://localhost:27017/",
  database: "test"
  //database: "TS_Database"
};

let _connection: mongodb.MongoClient = undefined;
let _db: mongodb.Db = undefined;

export class MongoConnect {
  public async getDB(): Promise<mongodb.Db> {
    if (_connection === undefined) {
      console.log("_connection === undefined");
      console.log(`mongoConfig.serverUrl = ${mongoConfig.serverUrl}`);
      //_connection = await MongoClient.connect(mongoConfig.serverUrl);
      _connection = await MongoClient.connect(mongoConfig.serverUrl, {useUnifiedTopology: true});
      console.log("initialized connection");
      console.log(`_connection = ${_connection}`);
      _db = await _connection.db(mongoConfig.database);
      console.log("initialized _db");
    }
    console.log("return db");
    return _db;
  }
}
