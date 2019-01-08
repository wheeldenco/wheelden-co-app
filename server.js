const express = require('express');
const bodyParser = require('body-parser');
const logger = require('heroku-logger');
const newCustomer = require('./newCustomer');

const app = express();
const port = process.env.PORT || 8888;

app.use(bodyParser.json());

app.get('/', (req, res) => res.status(401).send('You shouldn\'t be here'));

app.post('/newcustomer', async function (req, res) {
    try {
        logger.info('Creating new customer', req.body);
        const success = await newCustomer(req.body);
        res.status(success ? 200 : 500).send();
    } catch(err) {
        logger.error('Error in /customer', err);
    }
});

app.listen(port, () => logger.debug(`App listening on port ${port}!`))