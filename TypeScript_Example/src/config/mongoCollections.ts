import { MongoConnect } from './mongoConnection';
import { Collection } from 'mongodb';
let dbConnection = new MongoConnect();

export class MongoCollections {
  public _col: Collection = undefined;
  public async getCollectionFn(collection: string): Promise<Collection> {
        if (!this._col) {
	  console.log("!this._col");
          const db: {collection: Function} = await dbConnection.getDB();
	  console.log("Initialized db");
          this._col = await db.collection(collection);
	  console.log("Acquired db and _col");
        }
	console.log("Return _col");
        return this._col;
  }
}
