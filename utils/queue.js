import Bull from 'bull';
import redisClient from './redis';

// Initialize the Bull queues
const fileQueue = new Bull('fileQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

const userQueue = new Bull('userQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

export { fileQueue, userQueue };
