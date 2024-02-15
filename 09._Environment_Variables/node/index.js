import dotenv from 'dotenv';
dotenv.config({
    path: './.env-dev'
});


console.log(process.env.SOMETHING);