const Shopify = require('shopify-api-node'); 
const Mailchimp = require('mailchimp-api-v3');
const Hashids = require('hashids');
const hashids = new Hashids('NEWCUSTOMER');
const logger = require('heroku-logger');

require('dotenv').config()

const shopify = new Shopify({
    shopName : process.env.SHOPIFY_SHOP_NAME,
    apiKey : process.env.SHOPIFY_API_KEY,
    password : process.env.SHOPIFY_PASSWORD
});


const mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);

function createPriceRule(customer) {
    return shopify.priceRule.create({
        title : customer.id,
        target_type : 'line_item',
        target_selection : 'all',
        allocation_method : 'across',
        value_type : 'percentage',
        value : '-10',
        customer_selection : 'all',
        usage_limit : 1,
        starts_at : new Date()
    });
}

function createDiscount(customer, priceRule) {
    return shopify.discountCode.create(priceRule.id, {
        code : `HELLO-${hashids.encode(customer.id + Date.now())}`
    });
}

function createSubscriber(customer, discount) {
    return mailchimp.post(`/lists/${process.env.MAILCHIMP_DISCOUNT_LIST}/members`, {
        email_address : customer.email,
        status : 'subscribed',
        merge_fields : {
            DISCOUNT : discount.code
        }
    });
}

module.exports = async function(customer) {
    if (!customer.tags.includes('new_customer')) {
        logger.warn('New customer missing tag', customer.tags);
        return false;
    }

    try {
        const priceRule = await createPriceRule(customer);
        const discount = await createDiscount(customer, priceRule);
        await createSubscriber(customer, discount);
        return true;
    } catch (err) {
        logger.error('Error creating new customer', err)
        return false;
    }

}