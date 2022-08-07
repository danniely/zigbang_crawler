import express from 'express';
import dotenv from "dotenv";
import path from "path";
import { eachBatch } from './cron';

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/house', (req, res) => {
  const result = eachBatch();
  result.then((result) => res.send('house: ' + JSON.stringify(result))).catch((err) => res.send(err));
})

app.listen(port, () => {
    dotenv.config({ path: path.join(__dirname, ".env") });
    console.log(`Example app listening on port ${port}`);
})