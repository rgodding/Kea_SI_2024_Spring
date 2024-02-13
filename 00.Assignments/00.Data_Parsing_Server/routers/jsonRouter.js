// Router for JSON file parsing
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const jsonRouter = express.Router();

jsonRouter.get('/', async (req, res) => {
    const data = await FileParserJson()
    res.send(data)
});

async function FileParserJson() {
    const filePath = path.join(__dirname, "../data/me.json");
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}
export default jsonRouter;