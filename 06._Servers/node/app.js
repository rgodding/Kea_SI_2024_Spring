import express from "express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

            // request, response
app.get("/", (req, res) => {
    res.send({ message: "Hello" });
});

app.get("/python", (req, res) => {
    // Sends index html file
    res.sendFile(__dirname + "/index.html");
    
});

app.get("/otherRoute", (req, res) => {
    res.send({ message: "This is the other route" });
});

app.post("/postrequest", (req, res) => {
    res.send({ message: "You made a post request" });
});

const PORT = 8080;
app.listen(PORT, () => console.log("Server is running on port", PORT));