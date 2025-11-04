# Authentication Setup Instructions

## Overview
This React app now has a complete authentication system that saves credentials to a text file and authenticates users.

## Features
✅ Username and password authentication
✅ Credentials stored in `credentials.txt` file
✅ Remember Me functionality (saves credentials in browser localStorage)
✅ Forgot Password option
✅ Loading states and error handling
✅ Logout functionality

## How to Run

### Option 1: Run Both Frontend and Backend Together
```bash
# Terminal 1 - Start the backend server
npm run server

# Terminal 2 - Start the frontend (in a new terminal)
npm start
```

### Option 2: Manual Start
```bash
# Terminal 1 - Start backend server
node server.js

# Terminal 2 - Start frontend (in a new terminal)
npm start
```

## Test Credentials
The system comes with pre-configured test accounts in `credentials.txt`:
- Username: `admin` / Password: `admin123`
- Username: `user` / Password: `password123`

## How It Works

### Backend (server.js)
- Runs on `http://localhost:5000`
- Stores credentials in `credentials.txt` format: `username:password`
- Provides three endpoints:
  - `POST /api/login` - Authenticate user
  - `POST /api/register` - Register new user
  - `GET /api/users` - List all users (without passwords)

### Frontend (React App)
- Runs on `http://localhost:3000`
- Connects to backend API for authentication
- Stores "Remember Me" credentials in browser's localStorage
- Shows success/error messages
- Displays logged-in state with logout option

## Adding New Users

### Method 1: Via API
Use the register endpoint:
```bash
curl -X POST http://localhost:5000/api/register -H "Content-Type: application/json" -d "{\"username\":\"newuser\",\"password\":\"newpass\"}"
```

### Method 2: Manually Edit credentials.txt
Add a new line in the format:
```
username:password
```

## Security Note
⚠️ **Important**: This is a basic demonstration. For production:
- Use proper password hashing (bcrypt, argon2)
- Use a real database (MongoDB, PostgreSQL)
- Implement JWT tokens for session management
- Use HTTPS
- Add rate limiting
- Never store passwords in plain text

## File Structure
```
├── server.js              # Express backend server
├── credentials.txt        # User credentials storage
├── src/
│   ├── App.js            # Login component with authentication
│   └── App.css           # Styling for login page
└── package.json          # Dependencies and scripts
```

## Troubleshooting

### Error: "Unable to connect to server"
- Make sure backend is running: `node server.js`
- Check if port 5000 is available
- Verify the backend URL in App.js

### Login Not Working
- Check `credentials.txt` exists and has proper format
- Verify credentials match exactly (case-sensitive)
- Check browser console for error messages

### Remember Me Not Working
- Check browser localStorage is enabled
- Clear localStorage: `localStorage.clear()` in browser console
