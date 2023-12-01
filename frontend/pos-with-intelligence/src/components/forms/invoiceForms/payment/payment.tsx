import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import Navbar from '../../../navigation/nav';
import { loadStripe } from '@stripe/stripe-js';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px", // Adjust font size as needed
      "::placeholder": {
        color: "#aab7c4"
      },
      padding: '10px 12px', // Adjust padding as needed
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  }
};

const PaymentForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (paymentMethod === 'credit_card' && stripe && elements) {
      const cardElement = elements.getElement(CardElement);

      if (cardElement) {
        const { error, paymentMethod: createdPaymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

        if (error) {
          console.log('[error]', error);
        } else {
          console.log('[PaymentMethod]', createdPaymentMethod);


          try {
            const response = await axios.post('http://localhost:3001/process-payment', {
              paymentMethodId: createdPaymentMethod.id,
              invoiceId: id
            });
            console.log('Payment processed:', response.data);
            navigate(-1);
          } catch (error: any) {
            console.error('Error processing payment:', error.response.data);
          }
        }
      }
    } else {
      console.log('Processing cash payment...');
    }
  };

  return (
    <>
      <Navbar />
      <Container fluid="md" className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', minWidth: '100vh' }}>
        <Row>
          <Col xs={12} md={6}>
            <Form onSubmit={handleSubmit} className="mx-auto">
              {/* Payment method selection */}
              <Form.Group controlId="paymentMethod">
                <Form.Check
                  type="radio"
                  label="Credit card"
                  name="paymentMethod"
                  id="credit_card"
                  onChange={() => setPaymentMethod('credit_card')}
                  checked={paymentMethod === 'credit_card'}
                />
                <Form.Check
                  type="radio"
                  label="Cash"
                  name="paymentMethod"
                  id="cash"
                  onChange={() => setPaymentMethod('cash')}
                  checked={paymentMethod === 'cash'}
                />
              </Form.Group>

              {paymentMethod === 'credit_card' && (
                <div style={{ minWidth: '300px', maxWidth: '500px' }}> {/* Adjust the sizing as needed */}
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>
              
              )}

              <Button type="submit" className="mt-3">Confirm and pay</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PaymentForm;
