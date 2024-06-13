const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const accountSid = '****';
const authToken = '****';
const client = twilio(accountSid, authToken);

const app = express();
app.use(bodyParser.json());

// Endpoint to receive webhook from WooCommerce
app.post('/webhook', (req, res) => {
    console.log('Webhook received:', req.body); // Log the received webhook data

    const order = req.body;
    if (!order || !order.id || !order.total) {
        console.error('Invalid order data:', order);
        return res.status(400).send('Invalid order data.');
    }

    const ownerPhoneNumber = 'whatsapp:+212652600056'; // Replace with owner's WhatsApp number
    const message = `Canbus AdBlue New Order Received: Order ID - ${order.id}, Total - ${order.total}`;

    client.messages.create({
        from: 'whatsapp:+14155238886', // Replace with your Twilio sandbox number
        to: ownerPhoneNumber,
        body: message
    }).then(message => {
        console.log(`Message sent: ${message.sid}`);
        res.status(200).send('Webhook received and message sent.');
    }).catch(err => {
        console.error('Error sending message:', err);
        res.status(500).send('Error sending message.');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
