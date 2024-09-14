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

      <Typography variant="h3" gutterBottom fontFamily="'Poppins', sans-serif">
        Log in
      </Typography>
      <FederatedButton onClick={handleGoogleLogin} variant="outlined" fullWidth>
        <svg
          xmlns="https://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            fill="#4285F4"
            d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
          />
          <path
            fill="#34A853"
            d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
          />
          <path
            fill="#FBBC05"
            d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
          />
          <path
            fill="#EA4335"
            d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
          />
          <path fill="none" d="M2 2h44v44H2z" />
        </svg>{" "}
        Log in with Google
      </FederatedButton>
      <Divider style={{ width: "100%", margin: "20px 0" }}>or</Divider>

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
      <StyledButton type="submit" variant="contained" color="primary" fullWidth onClick={handleSubmit}>
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
