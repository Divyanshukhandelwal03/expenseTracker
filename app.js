require('dotenv').config();
const express = require('express');
const connectDB = require('./db.js');
const router=require('./routes.js');
const path=require("path");
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
  }));
  const cors = require("cors");
app.use(cors());
app.use(express.static(path.join(__dirname, "client/build")));

app.use(express.json());
app.use('/',router);
// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
