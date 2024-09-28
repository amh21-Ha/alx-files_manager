import { createClient } from 'redis';

// Define the RedisClient class
class RedisClient {
  constructor() {
    // Create a Redis client
    this.client = createClient();

    // Listen for any error event
    this.client.on('error', (err) => {
      console.error(`Redis client not connected to the server: ${err.message}`);
    });

    // Connect the Redis client
    this.client.connect();
  }

  // Method to check if Redis connection is alive
  isAlive() {
    return this.client.connected;
  }

  // Method to get value by key from Redis
  async get(key) {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (err) {
      console.error(`Error fetching data from Redis: ${err.message}`);
      return null;
    }
  }

  // Method to set value in Redis with expiration
  async set(key, value, duration) {
    try {
      await this.client.set(key, value, {
        EX: duration,
      });
    } catch (err) {
      console.error(`Error setting data in Redis: ${err.message}`);
    }
  }

  // Method to delete a key from Redis
  async del(key) {
    try {
      await this.client.del(key);
    } catch (err) {
      console.error(`Error deleting data from Redis: ${err.message}`);
    }
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
