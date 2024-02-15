import express from 'express';

const app = express();


app.get("/", (req, res) => {
    res.send("Hello World!");
});

import csvRouter from './routers/csvRouter.js';
import xmlRouter from './routers/xmlRouter.js';
import yamlRouter from './routers/yamlRouter.js';
import jsonRouter from './routers/jsonRouter.js';
import txtRouter from './routers/txtRouter.js';

app.use('/csv', csvRouter);
app.use('/xml', xmlRouter);
app.use('/yaml', yamlRouter);
app.use('/json', jsonRouter);
app.use('/txt', txtRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    }
);