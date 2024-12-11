jest.setTimeout(10000); // Set a longer timeout for async operations

// Mocking Redis
jest.mock('../utils/redis', () => ({
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
}));

// Mocking MongoDB client
jest.mock('../utils/db', () => ({
  db: {
    collection: jest.fn().mockReturnThis(),
    findOne: jest.fn(),
    insertOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  },
  ObjectId: jest.fn(),
}));
