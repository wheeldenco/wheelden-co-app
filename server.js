/*

    1. Receive webhook from Shopify
    2. Create a price rule (?)
    3. Create discount code
    4. Add subscriber to Mailchimp

*/

import express from 'express';
import newCustomer from './newCustomer';

const app = express();
const port = 3000;

app.get('/', (req, res) => res.status(401));

app.post('/newcustomer', function (req, res) {
    const success = newCustomer(res.body);
    res.status(success ? 200 : 500);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))