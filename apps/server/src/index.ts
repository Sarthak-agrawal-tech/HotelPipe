import express from 'express';
import whatsappRoutes from './routes/whatsapp';
import { startFollowupJob } from './jobs/followupJobs';
import { env } from './config/env';

const app = express();
app.use(express.json());

app.use('/api/whatsapp', whatsappRoutes);

startFollowupJob();

app.listen(env.PORT, () => {
  console.log(`HotelPipe Server running on port ${env.PORT}`);
});