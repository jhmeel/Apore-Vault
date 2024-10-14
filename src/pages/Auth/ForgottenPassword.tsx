import React, { useState, FormEvent, useEffect } from 'react';
import { Typography } from '@mui/material';
import { FormContainer, StyledTextField, StyledButton, Logo } from './shared';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import logoImg from '../../assets/logo.png'
import { dotPulse } from "ldrs";

const ForgottenPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      setIsLoading(true)
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    dotPulse.register();
  }, []);
  return (
    <FormContainer  onSubmit={handleSubmit}>
      <Logo src={logoImg} alt="Apore" />
      <Typography variant="h3" gutterBottom fontFamily="'Poppins', sans-serif">
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
        {error.replace("Firebase:","")}
        </Typography>
      )}
      {success && (
        <Typography color="primary" align="center" style={{ marginTop: 10 }}>
          Password reset email sent. Please check your inbox.
        </Typography>
      )}
      <StyledButton type="submit" variant="contained" color="primary" fullWidth>
      {loading ? (
            <div>
              <l-dot-pulse size="40" speed="2.5" color="#ccc"></l-dot-pulse>
            </div>
          ) : (
            "Reset password"
          )}
      </StyledButton>
      <Typography style={{ marginTop: 20 }}variant="body2">
        Remember your password?{' '}
        <Typography variant="body2" component="span" color="primary" style={{ cursor: 'pointer' }} onClick={() => navigate('/auth/login')}>
          Log in
        </Typography>
      </Typography>
    </FormContainer>
  );
};

export default ForgottenPassword;