const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session
app.use(session({
  secret: 'cors-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false
  }
}));

// CORS Misconfiguration
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin); // ⚠️ VULNERABLE
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Serve login page
app.use(express.static(path.join(__dirname, 'public')));

// POST /login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'h4ck3r') {
    req.session.loggedIn = true;
    return res.send('Login success! Go to <a href="/secret">/secret</a>');
  } else {
    return res.send('Login failed. <a href="/login.html">Try again</a>');
  }
});

app.get('/secret', (req, res) => {
  if (req.session.loggedIn) {
    res.json({
      id: 1337,
      name: 'Eka Raharja',
      username: 'admin',
      email: 'admin@example.com',
      password: 'h4ck3r'
    });
  } else {
    res.status(403).json({ error: 'Not authorized' });
  }
});

// Start
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
