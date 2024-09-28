import dbClient from '../utils/db';

describe('DBClient', () => {
  it('should insert a document into the collection', async () => {
    const document = { name: 'test' };
    await dbClient.db.collection('users').insertOne(document);
    expect(dbClient.db.collection('users').insertOne).toHaveBeenCalledWith(document);
  });

  it('should find a document in the collection', async () => {
    const document = { name: 'test' };
    dbClient.db.collection('users').findOne.mockResolvedValue(document);
    const result = await dbClient.db.collection('users').findOne({ name: 'test' });
    expect(result).toEqual(document);
  });

  it('should update a document in the collection', async () => {
    const update = { $set: { name: 'updated' } };
    await dbClient.db.collection('users').updateOne({ name: 'test' }, update);
    expect(dbClient.db.collection('users').updateOne).toHaveBeenCalledWith({ name: 'test' }, update);
  });
});
