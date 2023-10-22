"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
const express = require('express');
const bodyParser = require('body-parser');
app_1.app.use(bodyParser.urlencoded({ extended: true }));
app_1.app.use(bodyParser.json());
// Connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true });
