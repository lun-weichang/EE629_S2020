import { MongoConnect } from './mongoConnection';
import { Collection } from 'mongodb';
let dbConnection = new MongoConnect();

export class MongoCollections {
  public _col: Collection = undefined;

  public async getCollectionFn(collection: string): Promise<Collection> {
        if (!this._col) {
          const db: {collection: Function} = await dbConnection.getDB();
          this._col = await db.collection(collection);
        }
        return this._col;
  }
}
