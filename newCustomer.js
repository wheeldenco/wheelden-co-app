import Shopify from 'shopify-api-node'; 
import Mailchimp from 'mailchimp-api-v3';

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

function createDiscount(customer) {
    return shopify.discount.create(priceRule.id, {
        code : customer.id
    });
}

function createSubscriber(customer, discount) {
    return mailchimp.post(`/lists/${process.env.MAILCHIMP_DISCOUNT_LIST}/members`, {
        email_address : customer.email_address,
        status : 'subscribed',
        merge_fields : {
            DISCOUNT : discount.id
        }
    });
}

export default async function(customer) {

    try {
        console.log(customer);
        return true;
        const priceRule = await createPriceRule(customer);
        const discount = await createDiscount(customer, priceRule);
        const subscriber = await createSubscriber(customer, discount);

    } catch (err) {
        console.error(err);
        return false;
    }

}