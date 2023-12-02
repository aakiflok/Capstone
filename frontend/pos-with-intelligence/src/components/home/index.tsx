import React, { useEffect, useState } from 'react';
import Navbar from '../navigation/nav';
import { Container, Nav, Button, Row, Col, Card } from 'react-bootstrap';
import styles from './index.module.css';
const Home: React.FC = () => {


  return <><Navbar></Navbar>
    <Container>
    <Card className={`my-4 ${styles.jumbotronCustom}`}>
                    <Card.Body>
                        <Card.Title>Welcome to Intelligent POS System</Card.Title>
                        <Card.Text>
                            Simplifying sales and inventory management for retail shops.
                        </Card.Text>
                    </Card.Body>
                </Card>

      <Row>
        <Col>
          <h2>Features</h2>
          <ul className={styles.featureList}>
            <li className={styles.featureItem}>Product Discussion Platform</li>
            <li className={styles.featureItem}>Report Generation for Sales, Revenue, and Inventory</li>
            <li className={styles.featureItem}>CRUD Operations for Product, Invoice, Customer, and Stock Management</li>
            <li className={styles.featureItem}>Invoice and Transaction Filtering</li>
            <li className={styles.featureItem}>User Authentication for Security</li>
          </ul>
        </Col>
      </Row>
      <Row className="my-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Designed for Retail Businesses</Card.Title>
              <Card.Text>
                Whether you own a bookstore, clothing outlet, or technology store, our POS system offers the flexibility to meet your unique business needs. Manage your sales and inventory effortlessly with our user-friendly interface.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Optimized for Small and Medium-Sized Enterprises</Card.Title>
              <Card.Text>
                Our POS system is specifically developed for small and medium-sized businesses, focusing on simplifying sales transactions and providing a secure, easy-to-use platform for all your business operations.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container></>;
};

export default Home;
