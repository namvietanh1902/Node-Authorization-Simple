const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());


// view engine
app.set('view engine', 'ejs');
app.use("/",routes);

// database connection
const dbURI = 'mongodb://localhost:27017/node-auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get("*",authMiddleware.checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', authMiddleware.requireAuth,(req, res) => res.render('smoothies'));

