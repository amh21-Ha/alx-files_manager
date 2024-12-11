import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class DBClient {
  constructor() {
    // Retrieve MongoDB connection details from environment variables or set defaults
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    // MongoDB connection URL
    const url = `mongodb://${host}:${port}`;

    // Initialize MongoDB client and connect to the database
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.dbName = database;

    // Connect to the MongoDB server
    this.client.connect((err) => {
      if (err) {
        console.error(`MongoDB client not connected to the server: ${err.message}`);
      } else {
        console.log('MongoDB client connected successfully');
      }
    });
  }

  // Check if the MongoDB connection is alive
  isAlive() {
    return this.client && this.client.isConnected();
  }

  // Return the number of documents in the 'users' collection
  async nbUsers() {
    try {
      const db = this.client.db(this.dbName);
      const usersCollection = db.collection('users');
      const count = await usersCollection.countDocuments();
      return count;
    } catch (err) {
      console.error(`Error counting users in MongoDB: ${err.message}`);
      return 0;
    }
  }

  // Return the number of documents in the 'files' collection
  async nbFiles() {
    try {
      const db = this.client.db(this.dbName);
      const filesCollection = db.collection('files');
      const count = await filesCollection.countDocuments();
      return count;
    } catch (err) {
      console.error(`Error counting files in MongoDB: ${err.message}`);
      return 0;
    }
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
export default dbClient;
