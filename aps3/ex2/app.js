import 'dotenv/config';
import express from 'express';
import routes from './routes.js';
import { conectarRedis } from './redis.js';

const app = express();
app.use(express.json());

// Conectar ao Redis
await conectarRedis();

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});