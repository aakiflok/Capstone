import React from 'react';
import { Product } from '../../../models/product.module';
import { Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './productTile.css'
interface ProductTileProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductTile: React.FC<ProductTileProps> = ({ product, onClick }) => {
  return (
    <div className="product-tile">
      <Card onClick={() => onClick(product)}>
        <div
          className="card-image"
          style={{ backgroundImage: `url(${product.image_uri})` }}
        ></div>
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text>Price: ${product.price}</Card.Text>
          <Button variant="primary" onClick={() => onClick(product)}>
            View Details
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};


export default ProductTile;
