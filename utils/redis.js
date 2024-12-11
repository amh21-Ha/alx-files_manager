import redis from 'redis';

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    // Log errors to the console
    this.client.on('error', (err) => {
      console.error('Redis client error:', err);
    });
  }

  /**
   * Checks if the Redis client is connected.
   * @returns {boolean} True if connected, otherwise false.
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Gets the value of a key from Redis.
   * @param {string} key - The key to retrieve.
   * @returns {Promise<string | null>} The value of the key, or null if not found.
   */
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }

  /**
   * Sets a key-value pair in Redis with an expiration time.
   * @param {string} key - The key to set.
   * @param {string | number} value - The value to set.
   * @param {number} duration - Expiration time in seconds.
   * @returns {Promise<void>} Resolves when the value is set.
   */
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', duration, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Deletes a key from Redis.
   * @param {string} key - The key to delete.
   * @returns {Promise<void>} Resolves when the key is deleted.
   */
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;

