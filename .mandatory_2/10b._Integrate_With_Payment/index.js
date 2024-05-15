import express from 'express';
import Stripe from 'stripe';
import bodyParser from 'body-parser';

const app = express();
const stripe = new Stripe('sk_test_51O76ICDHvFZqPnkqtIDylAezcfJMUXzqA3VBNJm4MrxCcsexzHQ7kFDgX8403tn4v6o0WF3mDxSZCGKxLlBlcsDi002i0C2wZ3');

app.use(bodyParser.json());

app.post('/create-payment-intent', async (req, res) => {
    console.log('Creating payment intent');
    const paymentMethodId = req.body.payment_method_id;
    
    try {
        const paymentIntent = await orderFunction(paymentMethodId);
        console.log('Intent:', paymentIntent);
        res.json(paymentIntent);
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Functions
async function orderFunction(paymentMethodId) {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1000, // Amount in cents, e.g., $10.00
            currency: 'usd',
            payment_method: paymentMethodId,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never', // Ensure no redirects are used
            },
        });
        return paymentIntent;
    } catch (error) {
        throw error;
    }
}
