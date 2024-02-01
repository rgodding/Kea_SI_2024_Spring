const fs = require("fs");
const path = require("path");

async function FileParserCsv() {
    const filePath = path.join(__dirname, "me.csv");
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}

async function FileParserXml() {
    const filePath = path.join(__dirname, "me.xml");
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}

async function FileParserYaml() {
    const filePath = path.join(__dirname, "me.yaml");
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}

async function FileParserJson() {
    const filePath = path.join(__dirname, "me.json");
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}

function LabelPrinter(name) {
    console.log("\x1b[32m" + name + "\x1b[0m");
}

async function Start() {
    LabelPrinter("JSON");
    const jsonResult = await FileParserJson();
    console.log(jsonResult);

    LabelPrinter("CSV");
    const csvResult = await FileParserCsv();
    console.log(csvResult);

    LabelPrinter("XML");
    const xmlResult = await FileParserXml();
    console.log(xmlResult);

    LabelPrinter("YAML");
    const yamlResult = await FileParserYaml();
    console.log(yamlResult);
}

Start();