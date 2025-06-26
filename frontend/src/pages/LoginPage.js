import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #181818 60%, #1f1c2c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormBox = styled.div`
  background: #232526;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 28, 44, 0.37);
  width: 350px;
`;

const Title = styled.h2`
  color: #fff;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: none;
  background: #181818;
  color: #fff;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: #e50914;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background 0.2s;
  &:hover {
    background: #b0060f;
  }
`;

const Error = styled.div`
  color: #ff5252;
  margin-bottom: 1rem;
  text-align: center;
`;

const Switch = styled.div`
  color: #bbb;
  text-align: center;
  a {
    color: #e50914;
    text-decoration: none;
    font-weight: bold;
  }
`;

const LoginPage = () => {
  const { login, loading } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <Container>
      <FormBox>
        <Title>Sign In</Title>
        {error && <Error>{error}</Error>}
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Username"
            autoComplete="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <Switch>
          New to Movto? <Link to="/signup">Sign up now</Link>
        </Switch>
      </FormBox>
    </Container>
  );
};

export default LoginPage;