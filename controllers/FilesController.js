import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

class FilesController {
  static async postUpload(req, res) {
    const token = req.header('X-Token');
    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      name, type, parentId = 0, isPublic = false, data,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }

    if (!['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }

    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    if (parentId !== 0) {
      const parent = await dbClient.collection('files').findOne({ _id: parentId });

      if (!parent) {
        return res.status(400).json({ error: 'Parent not found' });
      }

      if (parent.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    const fileData = {
      userId,
      name,
      type,
      isPublic,
      parentId,
    };

    if (type === 'folder') {
      const result = await dbClient.collection('files').insertOne(fileData);
      return res.status(201).json({ id: result.insertedId, ...fileData });
    }

    if (!fs.existsSync(FOLDER_PATH)) {
      fs.mkdirSync(FOLDER_PATH, { recursive: true });
    }

    const localPath = path.join(FOLDER_PATH, uuidv4());
    fs.writeFileSync(localPath, Buffer.from(data, 'base64'));

    fileData.localPath = localPath;

    const result = await dbClient.collection('files').insertOne(fileData);
    return res.status(201).json({ id: result.insertedId, ...fileData });
  }

  static async putPublish(req, res) {
    const token = req.header('X-Token');
    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const file = await dbClient.collection('files').findOne({ _id: id, userId });

    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }

    await dbClient.collection('files').updateOne({ _id: id }, { $set: { isPublic: true } });
    const updatedFile = await dbClient.collection('files').findOne({ _id: id });

    return res.status(200).json(updatedFile);
  }

  static async putUnpublish(req, res) {
    const token = req.header('X-Token');
    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const file = await dbClient.collection('files').findOne({ _id: id, userId });

    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }

    await dbClient.collection('files').updateOne({ _id: id }, { $set: { isPublic: false } });
    const updatedFile = await dbClient.collection('files').findOne({ _id: id });

    return res.status(200).json(updatedFile);
  }
}

export default FilesController;
