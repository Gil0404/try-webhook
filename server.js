const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/ghl-webhook', async (req, res) => {
 
    const { firstName, lastName, email } = req.body;

    // Validate that required fields exist
    if (!email) {
      return res.status(400).send('Email is a required field.');
    }

    const shopifyPayload = {
      customer: {
        first_name: firstName,
        last_name: lastName,
        email: email,
      },
    };

    const shopifyStoreUrl = 'x1p256-by.myshopify.com';
    const shopifyApiToken = 'API_WEB_SHOP';
    const apiVersion = '2024-07'; // Use the latest stable API version

    // Make the HTTP POST request to Shopify's Admin API
    const response = await fetch(`${shopifyStoreUrl}/admin/api/${apiVersion}/customers.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': shopifyApiToken,
      },
      body: JSON.stringify(shopifyPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Shopify API Error:', data);
      return res.status(response.status).send(`Shopify API Error: ${data.errors ? JSON.stringify(data.errors) : response.statusText}`);
    }

    console.log('Customer created successfully in Shopify:', data);
    res.status(200).send('Webhook received and customer created.');

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).send('Internal Server Error.');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});