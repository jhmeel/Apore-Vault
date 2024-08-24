import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Typography, Grid, Divider, Button } from '@mui/material';
import { FormContainer, StyledTextField, StyledButton, Logo } from './shared';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { IUser } from '../../types';
import logoImg from '../../assets/logo.png';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IUser>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    dateOfBirth: '',
    country: '',
    phoneNumber: '',
    idDocument: null,
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'idDocument') {
      const files = e.target.files;
      if (files) {
        setFormData({ ...formData, idDocument: files[0] });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      let idDocumentUrl = '';
      if (formData.idDocument) {
        const storageRef = ref(storage, `idDocuments/${user.uid}`);
        await uploadBytes(storageRef, formData.idDocument);
        idDocumentUrl = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, 'users', user.uid), {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        country: formData.country,
        phoneNumber: formData.phoneNumber,
        idDocumentUrl,
      });

      navigate('/dashboard');
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, 'users', user.uid), {
        fullName: user.displayName,
        email: user.email,
      }, { merge: true });

      navigate('/dashboard');
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <FormContainer component="form" onSubmit={handleSubmit}>
      <Logo src={logoImg} alt="Apore" />
      <Typography variant="h5" gutterBottom>
        Sign Up for Apore Vault
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <StyledTextField
            fullWidth
            label="Full Name"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <StyledTextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <StyledTextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            required
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledTextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledTextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledTextField
            fullWidth
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            required
            InputLabelProps={{ shrink: true }}
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledTextField
            fullWidth
            label="Country"
            name="country"
            required
            value={formData.country}
            onChange={handleChange}
          />
        </Grid>
        {/* <Grid item xs={12}>
          <input
            accept="image/*,application/pdf"
            style={{ display: 'none' }}
            id="id-document-upload"
            type="file"
            onChange={handleChange}
            name="idDocument"
          />
          <label htmlFor="id-document-upload">
            <Button variant="outlined" component="span" fullWidth>
              Upload ID Document
            </Button>
          </label>
        </Grid> */}
      </Grid>
      {error && (
        <Typography color="error" align="center" style={{ marginTop: 10 }}>
          {error}
        </Typography>
      )}
      <StyledButton type="submit" variant="contained" color="primary" fullWidth>
        Sign Up
      </StyledButton>
      <Divider style={{ width: '100%', margin: '20px 0' }}>or</Divider>
      <StyledButton onClick={handleGoogleSignup} variant="outlined" fullWidth>
        Sign up with Google
      </StyledButton>
      <Typography style={{ marginTop: 20 }}>
        Already have an account?{' '}
        <Typography component="span" color="primary" style={{ cursor: 'pointer' }} onClick={() => navigate('/auth/login')}>
          Log in
        </Typography>
      </Typography>
    </FormContainer>
  );
};

export default Signup;