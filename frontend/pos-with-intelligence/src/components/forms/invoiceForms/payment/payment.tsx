import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import Navbar from '../../../navigation/nav';
import { loadStripe } from '@stripe/stripe-js';
import { useParams } from 'react-router-dom';



const PaymentForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

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

          // Add backend communication here
          try {
            const amount = await axios.get('/invoice-total',{
              params: {
                invoiceId: id 
              }
            })
            const response = await axios.post('/process-payment', {
              amount: amount, 
              paymentMethodId: createdPaymentMethod.id,
              invoiceId: id 
            });
            console.log('Payment processed:', response.data);
          } catch (error:any) {
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
      <Container fluid="md" className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh',minWidth: '100vh' }}>
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

              {paymentMethod === 'credit_card' && <CardElement />}

              <Button type="submit" className="mt-3">Confirm and pay</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PaymentForm;
