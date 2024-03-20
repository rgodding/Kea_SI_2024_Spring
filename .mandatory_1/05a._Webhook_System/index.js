import express from "express";
import Datastore from "nedb";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const db = new Datastore({ filename: "payment.db", autoload: true });

app.post("/ping", (req, res) => {
    console.log("Webhook received: ", req.body);
    res.sendStatus(204);
});

// Route to initiate a payment
app.post("/payment/initiate", (req, res) => {
    const paymentToken = generatePaymentToken();
    db.insert({ token: paymentToken, status: "pending" }, (err, newDoc) => {
        if (err) {
            res.status(500).json({ error: "Failed to initiate payment" });
        } else {
            // Send the payment token in the response
            res.json({ token: paymentToken });
        }
    });
});

// Route to confirm a payment
app.post("/payment/confirm", (req, res) => {
    const { token } = req.body;

    // Checks if the payment token exists in the database
    db.findOne({ token }, (err, payment) => {
        if (err) {
            res.status(500).json({ error: "Failed to confirm payment" });
        } else if (!payment) {
            res.status(400).json({ error: "Payment token not found" });
        } else {
            const paymentStatus = confirmPayment(token);
            if (paymentStatus === "success") {
                db.update({ token }, { $set: { status: "confirmed" } }, {}, (err, numReplaced) => {
                    if (err) {
                        res.status(500).json({ error: "Failed to confirm payment" });
                    } else {
                        res.status(200).json({ status: "Payment confirmed" });
                    }
                });
            } else {
                res.status(400).json({ error: "Payment not confirmed" });
            }
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

function generatePaymentToken() {
    return Math.random().toString(36).substring(7);
}

function confirmPayment(token, amount) {
    if (token === "success_token") {
        return "success";
    } else {
        return "failure";
    }
}
