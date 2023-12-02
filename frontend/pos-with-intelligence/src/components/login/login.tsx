import React, { useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import axios, { AxiosError } from 'axios';


import { useSignIn } from "react-auth-kit";;

function Login(props: any) {
  const [error, setError] = useState("");
  const signIn = useSignIn();
  const navigate = useNavigate();
  const onSubmit = async (values: any) => {
    console.log("Values: ", values);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3001/users/login",
        values
      );
      const userRole = response.data.user.role; 
      signIn({
        token: response.data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: { user: response.data.user },
      });
      // Redirect based on user role after successful sign-in
      navigate("/home");
    } catch (err) {
      if (err && err instanceof AxiosError)
        setError(err.response?.data.message);
      else if (err && err instanceof Error) setError(err.message);

    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit,
  });

  return (
    <Container className="mt-5 d-flex justify-content-center align-items-center min-vh-100">
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          {error && <p className="text-danger">{error}</p>}
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                style={{ borderColor: 'blue', color: 'blue' }} // Example: Blue color
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                style={{ borderColor: 'green', color: 'green' }} // Example: Green color
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={formik.isSubmitting}
              style={{ backgroundColor: 'blue', borderColor: 'blue' }} // Example: Blue color
            >
              {formik.isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export { Login };
