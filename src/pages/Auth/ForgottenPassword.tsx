import React, { useState, FormEvent } from 'react';
import { Typography } from '@mui/material';
import { FormContainer, StyledTextField, StyledButton, Logo } from './shared';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import logoImg from '../../assets/logo.png'

const ForgottenPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <FormContainer component="form" onSubmit={handleSubmit}>
      <Logo src={logoImg} alt="TBDex Wallet Logo" />
      <Typography variant="h5" gutterBottom>
        Reset Password
      </Typography>
      <StyledTextField
        fullWidth
        label="Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && (
        <Typography color="error" align="center" style={{ marginTop: 10 }}>
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="primary" align="center" style={{ marginTop: 10 }}>
          Password reset email sent. Please check your inbox.
        </Typography>
      )}
      <StyledButton type="submit" variant="contained" color="primary" fullWidth>
        Reset Password
      </StyledButton>
      <Typography style={{ marginTop: 20 }}>
        Remember your password?{' '}
        <Typography component="span" color="primary" style={{ cursor: 'pointer' }} onClick={() => navigate('/auth/login')}>
          Log in
        </Typography>
      </Typography>
    </FormContainer>
  );
};

export default ForgottenPassword;