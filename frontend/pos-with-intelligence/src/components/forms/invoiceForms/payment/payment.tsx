import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import Navbar from '../../../navigation/nav';
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51OHsRPHscfBqjZKX502JES3H3dITj30FsZsBqzIa3cRLubGnlvPN4TfMpKqWOaHkS08LrSpry8sJ2o307uz5b2Kq00RVRZR7yc');

interface PaymentFormProps {
  // Define additional props as needed
}

const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (paymentMethod === 'credit_card' && stripe && elements) {
      const cardElement = elements.getElement(CardElement);

      if (cardElement) {
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

        if (error) {
          console.log('[error]', error);
        } else {
          console.log('[PaymentMethod]', paymentMethod);
          // Process the paymentMethod.id with your backend
        }
      }
    } else {
      // Handle cash logic here
      console.log('Processing cash payment...');
    }
  };

  return (
    <>
      <Navbar />
      <Container fluid="md" className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh',minWidth: '100vh' }}>
        <Row>
          <Col xs={12} md={6}>
            <Form onSubmit={handleSubmit} className="mx-auto">
              {/* Payment method selection */}
              <Form.Group controlId="paymentMethod">
                {/* Credit Card */}
                <Form.Check 
                  type="radio" 
                  label="Credit card" 
                  name="paymentMethod" 
                  id="credit_card" 
                  onChange={() => setPaymentMethod('credit_card')} 
                  checked={paymentMethod === 'credit_card'} 
                />
                {/* Cash */}
                <Form.Check 
                  type="radio" 
                  label="Cash" 
                  name="paymentMethod" 
                  id="cash" 
                  onChange={() => setPaymentMethod('cash')} 
                  checked={paymentMethod === 'cash'} 
                />
              </Form.Group>

              {/* Card Element */}
              {paymentMethod === 'credit_card' && (
                <CardElement />
              )}

              {/* Submit Button */}
              <Button type="submit" className="mt-3">Confirm and pay</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PaymentForm;
