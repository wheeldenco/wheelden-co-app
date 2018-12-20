const express = require('express');
const newCustomer = require('./newCustomer');

const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => res.status(401).send('You shouldn\'t be here'));

app.post('/newcustomer', function (req, res) {
    const success = newCustomer(req.body);
    res.status(success ? 200 : 500).send();
});

app.listen(port, () => console.log(`App listening on port ${port}!`))