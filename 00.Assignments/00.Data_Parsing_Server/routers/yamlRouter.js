// Router for CSV file parsing
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const yamlRouter = express.Router();

yamlRouter.get('/', async (req, res) => {
    const data = await FileParserYaml()
    res.send(data)
});

async function FileParserYaml() {
    const filePath = path.join(__dirname, "../data/me.yaml");
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) reject(err);
            resolve(data)
        });
    });
}

async function parseYaml() {
    const yamlData = fs.readFileSync('./data.yaml', 'utf8');
    const jsonData = yaml.safeLoad(yamlData);
    console.log(jsonData);
}
export default yamlRouter;