import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import { userQueue } from '../utils/queue';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const existingUser = await dbClient.db.collection('users').findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const hashedPassword = sha1(password);
    const user = {
      email,
      password: hashedPassword,
    };

    const result = await dbClient.db.collection('users').insertOne(user);
    const newUserId = result.insertedId.toString();

    // Add a job to the userQueue for sending a welcome email
    await userQueue.add({ userId: newUserId });

    return res.status(201).json({ id: newUserId, email });
  }
}

export default UsersController;
