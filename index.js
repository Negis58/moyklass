require('dotenv').config();

const express = require('express');
const sequelize = require('./config/db');
const app = express();
const PORT = process.env.PORT;
const models = require('./models/models');
const router = require('./routes/lessonRoute');

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync()
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

app.use(express.json());
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server started on ${PORT} PORT`)
});