import React, { useState, useContext } from 'react';
import API from '../../api';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [indicator, setIndicator] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('[LoginForm] Initiating login for:', username);
    setLoading(true);
    setIndicator(null);
    try {
      console.log('[LoginForm] Using API instance');
      const response = await API.post('/auth/login', { username, password });
      console.log('[LoginForm] Login response:', response.data);
      login(response.data.user, response.data.token);
      // The redirect will happen automatically via the App component's routing logic
    } catch (error) {
      console.error('[LoginForm] Error during login:', error);
      const errMsg = error.response?.data?.error || 'An error occurred during login.';
      setIndicator({
        type: 'error',
        message: errMsg
      });
      setLoading(false);
    }
    // No need to setLoading(false) on success because the component will unmount
  };

  return (
    <div className="container">
      <form onSubmit={handleLogin} className="card">
        <h2><i className="fa-solid fa-right-to-bracket"></i> Login</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="login-username">Username</label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => {
              console.log('[LoginForm] Username changed:', e.target.value);
              setUsername(e.target.value);
            }}
            placeholder="Enter username"
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.5rem',
              border: 'none',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => {
              console.log('[LoginForm] Password changed');
              setPassword(e.target.value);
            }}
            placeholder="Enter password"
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.5rem',
              border: 'none',
              borderRadius: '4px'
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#3f51b5',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
          disabled={loading}
        >
          {loading ? (
            <i className="fa-solid fa-spinner fa-spin"></i>
          ) : (
            <i className="fa-solid fa-right-to-bracket"></i>
          )}{' '}
          Login
        </button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#009688' }}>Sign Up</Link>
        </p>
      </form>
      {indicator && (
        <div
          className="card"
          style={{
            borderLeft: indicator.type === 'success' ? '5px solid #4caf50' : '5px solid #f44336'
          }}
        >
          <p>{indicator.message}</p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;