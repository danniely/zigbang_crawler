import express from 'express';
import dotenv from "dotenv";
import path from "path";
import { eachBatch, batch } from './cron';
// import { init } from './db';

const app = express()
const port = 5000

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/house', async (req, res) => {
  await eachBatch();
})

app.listen(process.env.PORT || 5000, async () => {
    dotenv.config({ path: path.join(__dirname, ".env") });
    // await init();
    batch.start();
    console.log(`Example app listening on port ${port}`);
})