import React, { useState, FormEvent, useEffect } from "react";
import { Typography, Divider } from "@mui/material";
import {
  FormContainer,
  StyledTextField,
  StyledButton,
  Logo,
  FederatedButton,
} from "./shared";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import logoImg from "../../assets/logo.png";
import { dotPulse } from "ldrs";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/auth/checkin");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/auth/checkin");
    } catch (error) {
      setError((error as Error).message);
    }
  };
  useEffect(() => {
    dotPulse.register();
  }, []);

  return (
    <FormContainer>
      <Logo src={logoImg} alt="Apore" />

      <Typography variant="h2" gutterBottom fontFamily="'Poppins', sans-serif">
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
          {error.replace("Firebase:","")}
        </Typography>
      )}
      <StyledButton
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
      >
        {loading ? (
          <div>
            <l-dot-pulse size="40" speed="2.5" color="#ccc"></l-dot-pulse>
          </div>
        ) : (
          "Log in"
        )}
      </StyledButton>

      <Typography style={{ marginTop: 20 }} variant="body2">
        Don't have an account?{" "}
        <Typography
          variant="body2"
          component="span"
          color="primary"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/auth/signup")}
        >
          Sign up
        </Typography>
      </Typography>
      <Typography style={{ marginTop: 10 }} variant="body2">
        <Typography
          variant="body2"
          component="span"
          color="primary"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/auth/forgot-password")}
        >
          Forgot password?
        </Typography>
      </Typography>
    </FormContainer>
  );
};

export default Login;
