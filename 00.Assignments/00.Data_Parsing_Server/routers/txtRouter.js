// Router for TEXT file parsing
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const txtRouter = express.Router();

txtRouter.get('/', async (req, res) => {
    const data = await FileParserTxt()
    res.send(data)
});

async function FileParserTxt() {
    const filePath = path.join(__dirname, "../data/me.txt");
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}
export default txtRouter;