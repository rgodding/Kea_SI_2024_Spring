import express from 'express';

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: './public' });
});

app.listen(3000, () => 
    console.log('Server is running on http://localhost:3000')
);