const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

exports.createCheckoutSession = async (req, res) => {
  try {
    const { eventId, ticketQuantity, eventName, ticketPrice } = req.body;
    
    // Check if Stripe key is valid before calling Stripe API
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
      console.warn("⚠️ No Stripe Secret Key found in .env. Simulating successful checkout.");
      return res.json({ 
        id: 'mock_session_123', 
        url: `${req.headers.origin}/events/${eventId}?success=true&session_id=mock_session_123` 
      });
    }

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Ticket for: ${eventName || 'Event'}`,
            },
            unit_amount: Math.round(ticketPrice * 100), // Stripe expects cents
          },
          quantity: ticketQuantity || 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/events/${eventId}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/events/${eventId}?canceled=true`,
      metadata: {
        eventId,
        walletAddress: req.user ? req.user.walletAddress : 'guest',
      }
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
};
