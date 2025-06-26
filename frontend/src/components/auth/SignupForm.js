import React, { useState, useContext } from 'react';
import API from '../../api';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [indicator, setIndicator] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log('[SignupForm] Initiating signup for:', username);
    setLoading(true);
    setIndicator(null);
    try {
      console.log('[SignupForm] Using API instance');
      await API.post('/auth/signup', { username, password });
      
      // After successful signup, log the user in automatically
      const loginResponse = await API.post('/auth/login', { username, password });
      login(loginResponse.data.user, loginResponse.data.token);
      
      // Redirect will happen automatically via App.js
      
    } catch (error) {
      console.error('[SignupForm] Error during signup:', error);
      const errMsg = error.response?.data?.error || 'An error occurred during signup.';
      setIndicator({
        type: 'error',
        message: errMsg
      });
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSignup} className="card">
        <h2><i className="fa-solid fa-user-plus"></i> Sign Up</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="signup-username">Username</label>
          <input
            id="signup-username"
            type="text"
            value={username}
            onChange={(e) => {
              console.log('[SignupForm] Username changed:', e.target.value);
              setUsername(e.target.value);
            }}
            placeholder="Choose a username"
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
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => {
              console.log('[SignupForm] Password changed.');
              setPassword(e.target.value);
            }}
            placeholder="Choose a password"
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
            backgroundColor: '#009688',
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
            <i className="fa-solid fa-user-plus"></i>
          )}{' '}
          Sign Up
        </button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#3f51b5' }}>Log In</Link>
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

export default SignupForm;