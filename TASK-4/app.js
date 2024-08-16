const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();


const User = require('./models/User');

const app = express();

// Database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 180 * 60 * 1000 } // 3 hours
  }));
  

// Serve static files
app.use(express.static('views'));

// Routes
app.get('/', (req, res) => {
  if (req.session.username) {
    return res.redirect('/secured');
  }
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.username = username; // Store the username in the session
        return res.redirect('/secured');
      } else {
        res.send('Invalid username or password');
      }
    } catch (err) {
      console.error(err);
      res.send('An error occurred');
    }
  });
  

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/views/register.html');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.redirect('/login');
  } catch (err) {
    if (err.code === 11000) { // Duplicate username
      res.send('Username already exists');
    } else {
      console.error(err);
      res.send('An error occurred');
    }
  }
});

app.get('/secured', (req, res) => {
    if (req.session.username) {
      const username = req.session.username;
      res.send(`
       <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Secured Page</title>
  <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: "Poppins", sans-serif;
    }
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: url(bg.jpg) no-repeat;
      background-size: cover;
      background-position: center;
    }
    .wrapper {
      width: 420px;
      background: transparent;
      border: 2px solid rgba(255, 255, 255, .2);
      backdrop-filter: blur(9px);
      color: #fff;
      border-radius: 12px;
      padding: 30px 40px;
      text-align: center;
    }
    .wrapper h2 {
      font-size: 36px;
      margin-bottom: 20px;
    }
    .wrapper p {
      font-size: 16px;
      margin: 20px 0;
    }
    .wrapper .btn {
      width: 100%;
      height: 45px;
      background: #fff;
      border: none;
      outline: none;
      border-radius: 40px;
      box-shadow: 0 0 10px rgba(0, 0, 0, .1);
      cursor: pointer;
      font-size: 16px;
      color: #333;
      font-weight: 600;
      text-align: center;
      text-decoration: none;
    }
    .wrapper .btn:hover {
      background: #f0f0f0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <h2>Welcome, ${username}!</h2>
    <p>This is a secured page.</p>
    <p><a href="/logout" class="btn">Logout</a></p>
  </div>
</body>
</html>

      `);
    } else {
      res.redirect('/login');
    }
  });
  

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
