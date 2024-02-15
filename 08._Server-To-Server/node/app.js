import express from "express";

const app = express();
const poetryUrl = "http://127.0.0.1:8000";

app.get("/requestFastAPI", async (req, res) => {
    // make a request to /fastapiData here and serve as a response
    const data = await fetch(poetryUrl + "/fastapiData").then((res) => res.json());

    res.send({
        data: data,
    });
});

app.get("/expressData", (req, res) => {
    res.send({
        isRunning: true
    });
});

app.listen(8080, () => {
    console.log("Server is running on port", 8080);
});
