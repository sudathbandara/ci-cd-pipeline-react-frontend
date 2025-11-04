import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load remembered credentials on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Login successful! Welcome ' + data.username);
        setIsLoggedIn(true);
        
        // Handle remember me
        if (rememberMe) {
          localStorage.setItem('rememberedUsername', username);
          localStorage.setItem('rememberedPassword', password);
        } else {
          localStorage.removeItem('rememberedUsername');
          localStorage.removeItem('rememberedPassword');
        }
      } else {
        setMessage('Error: ' + data.message);
      }
    } catch (error) {
      setMessage('Error: Unable to connect to server. Make sure the backend is running.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setMessage('Please contact administrator to reset your password.');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setMessage('');
    if (!rememberMe) {
      setRememberMe(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="App">
        <div className="login-container">
          <div className="login-box">
            <h1 className="login-title">✓ Login Successful</h1>
            <p className="login-subtitle">Welcome, {username}!</p>
            <div className="success-message">{message}</div>
            <button onClick={handleLogout} className="login-button">
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Please login to your account</p>
          
          {message && (
            <div className={`message ${message.includes('Error') ? 'error-message' : 'success-message'}`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              
              <button
                type="button"
                className="forgot-password"
                onClick={handleForgotPassword}
                disabled={isLoading}
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <p className="test-credentials">
            Test Credentials: admin / admin123 or user / password123
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
