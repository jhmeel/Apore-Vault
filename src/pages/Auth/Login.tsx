import React, { useState, FormEvent } from 'react';
import { Typography, Divider } from '@mui/material';
import { FormContainer, StyledTextField, StyledButton, Logo } from './shared';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import logoImg from '../../assets/logo.png'

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <FormContainer component="form" onSubmit={handleSubmit}>
      <Logo src={logoImg} alt="Apore" />
      <Typography variant="h5" gutterBottom>
        Log in
      </Typography>
      <StyledTextField
        fullWidth
        label="Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <StyledTextField
        fullWidth
        label="Password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && (
        <Typography color="error" align="center" style={{ marginTop: 10 }}>
          {error}
        </Typography>
      )}
      <StyledButton type="submit" variant="contained" color="primary" fullWidth>
        Log In
      </StyledButton>
      <Divider style={{ width: '100%', margin: '20px 0' }}>or</Divider>
      <StyledButton onClick={handleGoogleLogin} variant="outlined" fullWidth>
        Log in with Google
      </StyledButton>
      <Typography style={{ marginTop: 20 }}>
        Don't have an account?{' '}
        <Typography component="span" color="primary" style={{ cursor: 'pointer' }} onClick={() => navigate('/auth/signup')}>
          Sign up
        </Typography>
      </Typography>
      <Typography style={{ marginTop: 10 }}>
        <Typography component="span" color="primary" style={{ cursor: 'pointer' }} onClick={() => navigate('/auth/forgot-password')}>
          Forgot password?
        </Typography>
      </Typography>
    </FormContainer>
  );
};

export default Login;