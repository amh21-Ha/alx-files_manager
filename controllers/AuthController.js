import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import crypto from 'crypto';

class AuthController {
  static async getConnect(req, res) {
    const authorization = req.headers.authorization || '';
    const encodedCredentials = authorization.split(' ')[1] || '';

    // Decode base64 and split into email and password
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString();
    const [email, password] = decodedCredentials.split(':');

    // Hash the password with SHA1
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    // Find the user by email and hashed password
    const user = await dbClient.client.db(dbClient.dbName).collection('users').findOne({ email, password: hashedPassword });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Generate a token using uuidv4
    const token = uuidv4();
    const tokenKey = `auth_${token}`;

    // Store the user ID in Redis for 24 hours
    await redisClient.set(tokenKey, user._id.toString(), 24 * 60 * 60);

    // Return the token
    return res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tokenKey = `auth_${token}`;
    const userId = await redisClient.get(tokenKey);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Delete the token from Redis
    await redisClient.del(tokenKey);

    return res.status(204).send();
  }
}

export default AuthController;
