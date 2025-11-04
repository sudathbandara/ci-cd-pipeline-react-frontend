const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

// File path for storing credentials
const CREDENTIALS_FILE = path.join(__dirname, 'credentials.txt');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize credentials file if it doesn't exist
if (!fs.existsSync(CREDENTIALS_FILE)) {
  fs.writeFileSync(CREDENTIALS_FILE, '', 'utf8');
}

// Helper function to read credentials from file
function readCredentials() {
  try {
    const data = fs.readFileSync(CREDENTIALS_FILE, 'utf8');
    const lines = data.split('\n').filter(line => line.trim() !== '');
    return lines.map(line => {
      const [username, password] = line.split(':');
      return { 
        username: username ? username.trim() : '', 
        password: password ? password.trim() : '' 
      };
    });
  } catch (error) {
    console.error('Error reading credentials:', error);
    return [];
  }
}

// Helper function to write credentials to file
function writeCredentials(credentials) {
  try {
    const data = credentials.map(cred => `${cred.username}:${cred.password}`).join('\n');
    fs.writeFileSync(CREDENTIALS_FILE, data, 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing credentials:', error);
    return false;
  }
}

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  console.log('Login attempt:', { username, password });

  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Username and password are required' 
    });
  }

  const credentials = readCredentials();
  console.log('Loaded credentials:', credentials);
  
  const user = credentials.find(
    cred => cred.username === username && cred.password === password
  );

  console.log('Found user:', user);

  if (user) {
    res.json({ 
      success: true, 
      message: 'Login successful',
      username: username
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid username or password' 
    });
  }
});

// Register endpoint (to add new users)
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Username and password are required' 
    });
  }

  const credentials = readCredentials();
  
  // Check if username already exists
  const existingUser = credentials.find(cred => cred.username === username);
  if (existingUser) {
    return res.status(409).json({ 
      success: false, 
      message: 'Username already exists' 
    });
  }

  // Add new user
  credentials.push({ username, password });
  const success = writeCredentials(credentials);

  if (success) {
    res.json({ 
      success: true, 
      message: 'Registration successful' 
    });
  } else {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save credentials' 
    });
  }
});

// Get all users endpoint (for testing purposes)
app.get('/api/users', (req, res) => {
  const credentials = readCredentials();
  // Don't send passwords in response
  const users = credentials.map(cred => ({ username: cred.username }));
  res.json({ success: true, users });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Credentials file: ${CREDENTIALS_FILE}`);
});
