import express from 'express';
import itemRoutes from './routes/itemRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/items', itemRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
