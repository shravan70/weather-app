import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button'; 
import { Container, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error('Login failed');
      }

      const data = await res.json();
      console.log('User data:', data);

      // Save username to localStorage
      localStorage.setItem('username', username);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '50px', 
      marginLeft: '550px', backgroundColor: '#f5f5f5', 
      padding: '20px', borderRadius: '8px' }}>
    <form onSubmit={handleLogin}>
      <Typography variant="h4" align="center" style={{ color: '#242424', fontWeight:'bold' }}>
        Login
      </Typography>

     
      <div   style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',       
    gap: '16px',                
    marginTop: '50px',
  }}>

     {error && <p style={{ color: 'red' }}>{error}</p>}
        <TextField
          required
          id="outlined-required"
         
          placeholder='Username' type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
    
        <TextField
        placeholder='Password'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      
      <Button type="submit" variant="contained" >Login</Button>
      </div>
    </form>
    </Container>
  );
};

export default LoginPage;
