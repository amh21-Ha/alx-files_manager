import express from 'express';
import routes from './routes/index';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();

// Use JSON middleware to handle JSON request bodies
app.use(express.json());

// Load routes
app.use('/', routes);

// Get port from environment or default to 5000
const port = process.env.PORT || 5000;

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
