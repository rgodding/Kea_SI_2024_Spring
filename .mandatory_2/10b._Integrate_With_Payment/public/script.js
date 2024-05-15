// Initialize Stripe with your publishable key
const stripe = Stripe('pk_test_51O76ICDHvFZqPnkqHzXCCYdf02rJBpjp9UpNWMTFBsOj71HMcWmLnILdsYVJJCs1iKyX5yOEyl13ueQYDJ7nnplC00QQwXUc2X');

// Create an instance of Elements
const elements = stripe.elements();

// Create an instance of the card Element
const card = elements.create('card');

// Add an instance of the card Element into the `card-element` <div>
card.mount('#card-element');

// Handle real-time validation errors from the card Element
card.on('change', function(event) {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});

// Handle form submission
const form = document.getElementById('test-payment-form');
form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: card,
    });

    if (error) {
        // Display error.message in your UI
        const displayError = document.getElementById('card-errors');
        displayError.textContent = error.message;
    } else {
        // Send the paymentMethod.id to your server
        fetch('/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                payment_method_id: paymentMethod.id,
            }),
        })
        .then(response => response.json())
        .then(paymentIntent => {
            if (paymentIntent.error) {
                const displayError = document.getElementById('card-errors');
                displayError.textContent = paymentIntent.error;
            } else {
                // Handle successful payment here (e.g., show a success message)
                alert('Payment successful!');
            }
        });
    }
});