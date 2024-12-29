const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

const stripe = require('stripe')('sk_test_51M2LCuB0HvM76eskVDLRxnZBbPJlr0FyAtBdlequvUlCqD4Tp21rcpFYmPqQIzw1QsJcFmj3DaKc5HmdUrW7Tad100auy1Cii6');

app.post('/check-subscription', async (req, res) => {
  const { email } = req.body;
  try {
    const customers = await stripe.customers.list({ email });
    if (customers.data.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    const customer = customers.data[0];
    const subscriptions = await stripe.subscriptions.list({ customer: customer.id });
    const activeSubscription = subscriptions.data.find(sub => sub.status === 'active');
    if (activeSubscription) {
      return res.json({ active: true, subscriptionId: activeSubscription.id });
    } else {
      return res.json({ active: false });
    }
  } catch (error) {
    console.error('Error checking subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000.');
});
