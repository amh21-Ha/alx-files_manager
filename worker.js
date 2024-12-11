import { userQueue, fileQueue } from './utils/queue';
import dbClient from './utils/db';

// Process the userQueue
userQueue.process(async (job) => {
  const { userId } = job.data;

  if (!userId) {
    throw new Error('Missing userId');
  }

  const user = await dbClient.db.collection('users').findOne({ _id: dbClient.ObjectId(userId) });

  if (!user) {
    throw new Error('User not found');
  }

  // In real life, you would send an email here using a third-party service like Mailgun or SendGrid
  console.log(`Welcome ${user.email}!`);
});

// Process the fileQueue (your existing file processing logic)
fileQueue.process(async (job) => {
  // Existing file processing logic...
});
