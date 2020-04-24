import * as mongodb from "mongodb";
const MongoClient: {connect: Function} = mongodb.MongoClient;

const mongoConfig: {serverUrl: string, database: string} = {
  serverUrl: "mongodb://localhost:27017/",
  database: "Chang-LunWei-CS554-Lab1"
};

let _connection: mongodb.MongoClient = undefined;
let _db: mongodb.Db = undefined;

export class MongoConnect {
  public async getDB(): Promise<mongodb.Db> {
    if (_connection === undefined) {
      _connection = await MongoClient.connect(mongoConfig.serverUrl);
      _db = await _connection.db(mongoConfig.database);
    }
    return _db;
  }
}
