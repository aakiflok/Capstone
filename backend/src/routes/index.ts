import { app } from "../app";

const express = require('express');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true });
