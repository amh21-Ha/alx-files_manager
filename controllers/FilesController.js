import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import mime from 'mime-types';  // Import mime-types to get the correct MIME type

class FilesController {
  // GET /files/:id/data
  static async getFile(req, res) {
    const fileId = req.params.id;
    const token = req.headers['x-token'] || null;
    let userId = null;

    // Check if the user is authenticated via token
    if (token) {
      userId = await redisClient.get(`auth_${token}`);
    }

    try {
      const file = await dbClient.db.collection('files').findOne({ _id: ObjectId(fileId) });

      if (!file) {
        return res.status(404).json({ error: 'Not found' });
      }

      // If the document is a folder, return an error
      if (file.type === 'folder') {
        return res.status(400).json({ error: "A folder doesn't have content" });
      }

      // If the file is not public and the user is either not authenticated or not the owner
      if (!file.isPublic && (!userId || String(file.userId) !== String(userId))) {
        return res.status(404).json({ error: 'Not found' });
      }

      // Check if the file exists locally
      const filePath = file.localPath;
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Not found' });
      }

      // Get the MIME type of the file
      const mimeType = mime.lookup(file.name);
      if (!mimeType) {
        return res.status(400).json({ error: 'Invalid file type' });
      }

      // Read and return the content of the file with the correct MIME type
      const fileContent = fs.readFileSync(filePath);
      res.setHeader('Content-Type', mimeType);
      return res.status(200).send(fileContent);
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
      if (file.type === 'image') {
	fileQueue.add({
        userId: file.userId,
        fileId: file._id.toString(),
      });
    }

    return res.status(201).json(file);
  }
}

export default FilesController;
