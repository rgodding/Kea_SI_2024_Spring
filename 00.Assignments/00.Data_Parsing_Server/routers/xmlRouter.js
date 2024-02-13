// Router for CSV file parsing
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import xml2js from 'xml2js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const csvRouter = express.Router();

csvRouter.get('/', async (req, res) => {
    const data = await FileParserCsv() 
    res.send(data)
});

async function FileParserCsv() {
    const filePath = path.join(__dirname, "../data/me.xml");
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) reject(err);
            xml2js.parseString(data, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    });
}
export default csvRouter;