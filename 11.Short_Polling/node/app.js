import express from "express";
const app = express();
const port = 8080;

// Share public folder
app.use(express.static("public"));

const randomNumbers = [];


app.get("/randomNumbers", (req, res) => {
    res.send({ data: randomNumbers})
});

app.get("/simulateRandomNumbers", (req, res) => {
    const newNumber = getRandomInt(3, 1001)
    randomNumbers.push(newNumber);
    res.send({ data: newNumber})
})

function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});