/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Typography, Grid, Divider, MenuItem, styled } from "@mui/material";
import {
  FormContainer,
  StyledTextField,
  StyledButton,
  Logo,
  FederatedButton,
} from "./shared.js";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { africanCountries, IUser } from "../../types";
import logoImg from "../../assets/logo.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useUserActions } from "../../actions";
import { holdings } from "../../utils";
import { dotPulse } from "ldrs";

const StyledPhoneInput = styled(PhoneInput)(({ theme }) => ({
  "& .form-control": {
    width: "100%",
    height: "56px",
    fontSize: "1rem",
    borderRadius: theme.shape.borderRadius,
    padding: "16.5px 14px",
    paddingLeft: "48px",
    borderColor:
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.23)"
        : "rgba(255, 255, 255, 0.23)",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
      borderColor: theme.palette.text.primary,
    },
    "&:focus": {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
      boxShadow: `${theme.palette.primary.main} 0 0 0 1px`,
    },
  },
  "& .flag-dropdown": {
    backgroundColor: "transparent",
    border: "none",
    color: theme.palette.text.secondary,
    "& .selected-flag": {
      backgroundColor: "transparent",
      "&:hover, &:focus": {
        backgroundColor: "transparent",
      },
    },
  },
}));

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { createHoldings, createDID } = useUserActions();
  const [loading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<IUser>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    country: "",
    phoneNumber: "",
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "idDocument") {
      const files = e.target.files;
      if (files) {
        setFormData({ ...formData, idDocument: files[0] });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handlePhoneChange = (value: string, country: any) => {
    setFormData({ ...formData, phoneNumber: value, country: country.name });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        country: formData.country,
        phoneNumber: formData.phoneNumber,
      });
      await createDID(user.uid);
      await createHoldings(user.uid, holdings);
      navigate("/auth/checkin");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          fullName: user.displayName,
          email: user.email,
        },
        { merge: true }
      );
      await createDID(user.uid);
      await createHoldings(user.uid, holdings);
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
      <Typography variant="h2" alignSelf={"left"} fontFamily="'Poppins', sans-serif">
        Create Account
      </Typography>
      <Typography variant="body2" fontSize={12} color={"grey"} textAlign={"center"} gutterBottom fontFamily="'Poppins', sans-serif" marginBottom={2}>
      Experience secure and seamless interborder transactions powered by <b>TbDEX</b>
      </Typography>
      <form onSubmit={handleSubmit}>
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
            <StyledPhoneInput
              country={"za"}
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              inputProps={{
                name: "phoneNumber",
                required: true,
                autoFocus: true,
              }}
              countryCodeEditable={false}
              onlyCountries={africanCountries.map((country) =>
                country.code.toLowerCase()
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
              select
              fullWidth
              label="Country"
              name="country"
              required
              value={formData.country}
              onChange={handleChange}
            >
              {africanCountries.map((country) => (
                <MenuItem key={country.code} value={country.name}>
                  <span>{country.name}</span>
                </MenuItem>
              ))}
            </StyledTextField>
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
        </Grid>
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
          style={{ marginTop: "20px" }}
        >
          {loading ? (
            <div>
              <l-dot-pulse size="40" speed="2.5" color="#ccc"></l-dot-pulse>
            </div>
          ) : (
            "Sign Up"
          )}
        </StyledButton>
      </form>

      <Typography variant="body2" style={{ marginTop: 20 }}>
        Already have an account?{" "}
        <Typography
          variant="body2"
          component="span"
          color="primary"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/auth/login")}
        >
          Log in
        </Typography>
      </Typography>
    </FormContainer>
  );
};

export default Signup;
