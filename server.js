const express = require('express');
const newCustomer = require('./newCustomer');

const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.get('/', (req, res) => res.status(401).send('You shouldn\'t be here'));

app.post('/newcustomer', function (req, res) {
    const success = newCustomer(req.body);
    res.status(success ? 200 : 500).send();
});

app.get('/test', async (req, res) => {
    const success = await newCustomer(require('./mock/customer.json'));
    res.status(success ? 200 : 400).send();
});

app.listen(port, () => console.log(`App listening on port ${port}!`))